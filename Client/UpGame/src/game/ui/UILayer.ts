module ui {

    /**
     *
     * 该类代表UI所在的层级。为了避免跟场景／战斗层有过多的干涉，尽量把UI相关的部分都写到这边来。两者可以依靠更加独立的系统（应该是事件）
     * 来通信。
     *
     * UI层可以认为完全是覆盖在场景层之上的，而且这一层始终存在。只是根据场景不同（首页／战斗），出现的主要元素不同，所以目前可以根据显示
     * 层级分为两个部分：底层－主UI，上层－弹出层。
     *
     * 主UI包括但不限于：
     *   首页界面内的Dock
     *   首页界面内的由Dock控制的跳转界面
     *   首页界面内的HUD
     *   战斗场景的HUD
     *   战斗场景的操作按钮
     * 弹出层包括但不限于：
     *   首页界面内可能的弹出窗口
     *   战斗场景的弹出窗口
     *   其他可能的弹出窗口（比如运营活动弹窗）
     *
     * 还需要建立一个独立的事件系统（类似或者直接借用上一个项目的slot模式），来方便的触发UI更新。
     */
    export class UILayer {

        // 单例
        private static ins:UILayer;
        public static get Ins():UILayer {
            if (this.ins == null) this.ins = new ui.UILayer();
            return this.ins;
        }

        public static DESIGN_WIDTH:number = 640;
        public static DESIGN_HEIGHT:number = 960;
        public static ACTUAL_WIDTH:number;
        public static ACTUAL_HEIGHT:number;

        private static MIN_SUPPORT_RATIO:number = 1.2;
        private static MAIN_LAYER_INDEX:any = {
            BACKGROUND:-1,
            BATTLE:0,
            UI:1
        };
        private static SUB_LAYER_INDEX:any = {
            GAME:0,
            POPUP:1,
            // LOCKER:2,
            FTUE:3
        };

        private Stage:egret.Stage;
        private rootLayer:egret.DisplayObjectContainer;
        private _uiLayer:fairygui.GComponent;//UI
        private __gameLayer:UIGameLayer;// 游戏界面的主UI层
        private __popupLayer:UIPopupLayer;// 弹出框层
        // private __screenLocker:ScreenLocker;//锁屏

        private _lockUIQueue:any[] = [];
        private _lockScreenQueue:any[] = [];

        // 当前场景状态
        private currentStatus:string;
        private lastStatus:string;

        /*
        * 切换场景。
        * 目前分为主场景和战斗场景，后续有再添加。
        *
        * @param statusId string 来源于ui.UIStatusIds
        * */
        public switchStatus(statusId:string, ...args):void {
            var self = this;

            self.lockScreen(true);

            self.lastStatus = self.currentStatus;
            if (statusId == ui.UIStatusIds.MAIN && statusId == self.currentStatus && args.length > 0) {
                // 首页里面切换页签
                var singal = game.GameEvent.UI_SWITCH_INSIDE_MAIN;
                singal.dispatch.apply(singal, args);
            } else if (self.currentStatus != statusId) {
                // console.log(`ui status: ${statusId}`);
                self.currentStatus = statusId;

                self.switchLoading(self.currentStatus, function ():void {
                    self.__gameLayer.clear();
                    self.__popupLayer.clear();
                    //ui.FTUE.Ins.clear();

                    self.__gameLayer.switchStatus.apply(self.__gameLayer, [self.currentStatus].concat(args));
                }, self);
            }
        }

        /*
        * 显示一个加载弹窗用来做过场
        * */
        private switchLoading(status:string, callback:Function, context:any):void {
            var popup:IPopup;
            // if (status == ui.UIStatusIds.FORMATION) {
            //     popup = this.popup(ui.PopUpIds.FORMATION_LOADING);
            // } else if (status == ui.UIStatusIds.FIGHT ||
            // status == ui.UIStatusIds.PVP_FIGHT) {
            //     popup = this.popup(ui.PopUpIds.BATTLE_LOADING);
            // }
            if (popup)
                popup.onClose(callback, context);
            else
                if (callback) callback.apply(context);
        }

        /*
        * 弹窗。
        *
        * @param identity string 来源于ui.PopupIds
        * */
        public popup(identity:string, ...args):IPopup {
            args.unshift(identity);
            return this.__popupLayer.popup.apply(this.__popupLayer, args);
        }

        public clearAllPopUp():void{
            console.log('[UILayer]', 'clearAllPopUp');
            this.__popupLayer.clear();
        }

        /*
        * 锁屏
        * */
        public lockScreen(lock:boolean = true):void {
            this.lockUI(lock);

            if (lock) this._lockScreenQueue.push(true);
            else this._lockScreenQueue.pop();
            if (this._lockScreenQueue.length == 0) {
                fairygui.GRoot.inst.closeModalWait();
            } else {
                fairygui.GRoot.inst.showModalWait();
            }
            // this.__screenLocker.visible = this._lockScreenQueue.length > 0;
            // console.log(`[UILayer] lock: ${lock}`);
        }

        /*
        * 单独锁UI
        * */
        public lockUI(lock:boolean = true):void {
            if (lock) this._lockUIQueue.push(true);
            else this._lockUIQueue.pop();
            this._uiLayer.touchable = this._lockUIQueue.length == 0;
        }

        /*
        * 获取当前场景状态
        * */
        public getCurrentStatus():string{
            return this.currentStatus;
        }

        /*
        * 获取上一个场景的状态
        * */
        public getLastStatus():string {
            return this.lastStatus;
        }

        public stage():egret.Stage {
            return this.Stage;
        }

        public init(stage:egret.Stage):void {
            var self = this;

            self.Stage = stage;

            self.rootLayer = new egret.DisplayObjectContainer();
            self.updatePositionAndSizeOfRootLayer(stage.stageWidth, stage.stageHeight);

            self._uiLayer = self.createFairyGUI();
            self.__gameLayer = new UIGameLayer();
            self.__popupLayer = new UIPopupLayer();
            self.lockScreen(false);
            self._uiLayer.addChildAt(self.__gameLayer, UILayer.SUB_LAYER_INDEX.GAME);
            // self._uiLayer.addChildAt(self.__popupLayer, UILayer.SUB_LAYER_INDEX.POPUP);
            // self._uiLayer.addChildAt(self.__screenLocker, UILayer.SUB_LAYER_INDEX.LOCKER);

            self.rootLayer.addChildAt(self._uiLayer.displayObject, UILayer.MAIN_LAYER_INDEX.UI);
            stage.addChild(self.rootLayer);

            self.registerListeners();
        }

        private registerListeners():void {
            game.GameEvent.UI_SWITCH.add(this.switchStatus, this);
            game.GameEvent.LOCK_SCREEN.add(this.lockScreen, this);
        }

        public resizeWin():void {
            this.updatePositionAndSizeOfRootLayer(this.Stage.stageWidth, this.Stage.stageHeight);
        }

        private updatePositionAndSizeOfRootLayer(stageWidth:number, stageHeight:number):void {
            var screenRatio = stageHeight / stageWidth;
            if (screenRatio >= UILayer.MIN_SUPPORT_RATIO) {
                UILayer.ACTUAL_HEIGHT = stageHeight;
                UILayer.ACTUAL_WIDTH = stageWidth;

                this.rootLayer.x = 0;
                this.rootLayer.y = 0;
            } else {
                UILayer.ACTUAL_HEIGHT = stageHeight;
                UILayer.ACTUAL_WIDTH = Math.floor(stageHeight / UILayer.MIN_SUPPORT_RATIO);

                this.rootLayer.x = Math.round((stageWidth - UILayer.ACTUAL_WIDTH) / 2);
                this.rootLayer.y = 0;
            }

            // 设置整个舞台在一个mask下，不会超出这个区域
            var maskRect:any = this.rootLayer.mask;
            if (!maskRect) {
                maskRect = new egret.Rectangle(0, 0, UILayer.ACTUAL_WIDTH, UILayer.ACTUAL_HEIGHT);
            } else {
                maskRect.setTo(0, 0, UILayer.ACTUAL_WIDTH, UILayer.ACTUAL_HEIGHT);
            }
            this.rootLayer.mask = maskRect;
        }

        private createFairyGUI():fairygui.GComponent {
            fairygui.GRoot.inst.setSize(UILayer.ACTUAL_WIDTH, UILayer.ACTUAL_HEIGHT);
            return fairygui.GRoot.inst;
        }
    }
}