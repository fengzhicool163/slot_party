/**
 * Created by huangqingfeng on 16/4/27.
 */
module ui {

    export class UIPopupLayer {

        private static CACHE_ID:string[];

        // /*
        // * 半透黑背景
        // * */
        // private graph:fairygui.GGraph;

        // 注册的弹窗
        private POPUP_MAP:Object = null;
        // 弹窗缓存
        private POPUP_INSTS:Array<IPopup> = null;
        // 弹窗静态缓存,除非清空场景,否则不重新创建
        private POPUP_CACHES:any = null;
        // 是否锁定了弹框关闭能力
        private lock:boolean = false;

        public constructor() {
            this.init();

            game.GameEvent.UI_LOADING_LOCK.add(this.onLock, this);
        }

        /*
         * 弹窗。
         *
         * @param identity
         * */
        public popup(identity:string, ...args):IPopup {
            if (this.POPUP_MAP.hasOwnProperty(identity)) {
                var popup:IPopup = null;
                if (this.POPUP_CACHES[identity]) {
                    popup = this.POPUP_CACHES[identity];
                } else {
                    var popupCls:any = this.POPUP_MAP[identity];
                    popup = new popupCls();

                    if (UIPopupLayer.CACHE_ID.indexOf(identity) != -1) {
                        this.POPUP_CACHES[identity] = popup;
                    }

                    this.POPUP_INSTS.push(popup);
                }

                popup.update.apply(popup, args);
                popup.show();
                popup.onCloseDefault(this.onPopupClosed, this);

                // if (this.getChildIndex(this.graph) == -1) {
                //     this.graph.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
                //     this.addChild(this.graph);

                //     // 点击关闭
                //     this.addClickListener(this.onClickClose, this);
                // }

                return popup;
            }
            return null;
        }

        // private onClickClose():void {
        //     if (!this.lock) {
        //         this.closeCurrent();
        //     }
        // }

        /*
        * 关闭当前弹窗
        * */
        private closeCurrent():void {
            if (this.POPUP_INSTS.length) {
                var current:IPopup = this.POPUP_INSTS[this.POPUP_INSTS.length - 1];
                // 是否允许点击外部关闭
                if (current.closeWhenClickOutside()) {
                    this.POPUP_INSTS.pop();
                    current.hide();
                }
            }
        }

        /*
        * 关闭当前所有弹窗
        * */
        private closeAll():void {
            // console.log('[UIPopupLayer]', 'clearAll');
            var self = this, inst:IPopup[] = self.POPUP_INSTS.concat();
            self.POPUP_INSTS = [];
            for (var i:number = 0, len:number = inst.length; i < len; i ++) {
                inst[i].hide();
            }
        }

        /*
        * 清空所有弹窗
        * */
        public clear():void {
            // console.log('[UIPopupLayer]', 'clear');
            this.closeAll();
            this.clean();
        }

        /*
        * dispose
        * */
        private clean():void {
            this.POPUP_CACHES = {};
            // if (this.getChildIndex(this.graph) != -1) {
            //     this.removeChild(this.graph);
            // }

            this.lock = false;
            // this.removeClickListener(this.onClickClose, this);
        }

        private init():void {
            var self = this;

            // 注册定义
            self.POPUP_MAP = {};
            // 初始化本地池
            self.POPUP_INSTS = [];
            self.POPUP_CACHES = {};
            self.POPUP_MAP[PopUpIds.RANKINGPOP] = RankingPop;
            self.POPUP_MAP[PopUpIds.BIG_WIN] = PopResult;
            self.POPUP_MAP[PopUpIds.SUPER_WIN] = PopSuperResult;
            self.POPUP_MAP[PopUpIds.NOTIFICATION] = NotificationPopup;
            self.POPUP_MAP[PopUpIds.SLOT] = Rule;
            self.POPUP_MAP[PopUpIds.RANKING] = Ranking;
            self.POPUP_MAP[PopUpIds.FANLI] = PopFanli;
            self.POPUP_MAP[PopUpIds.JACKPOT] = PopJackpotResult;
            UIPopupLayer.CACHE_ID = _.keys(self.POPUP_MAP);
        }

        /*
        * 弹窗关闭的回调方法
        * */
        protected onPopupClosed(popup:any):void {
            if (popup && this.POPUP_INSTS.indexOf(popup) != -1) {
                this.POPUP_INSTS.splice(this.POPUP_INSTS.indexOf(popup), 1);
            }
            if (this.POPUP_INSTS.length == 0) {
                this.clean();
            }
        }

        /*
        * 设置点击关闭弹窗功能的锁定状态.
        * */
        private onLock(bl:boolean):void {
            this.lock = bl;
        }

    }

    /*
     * 弹窗的接口。
     * */
    export interface IPopup {

        hasLoaded():boolean;
        /*
        * 点击窗外是否关闭窗口
        * */
        closeWhenClickOutside():boolean;
        update(...args):void;
        show():void;
        hide():void;
        onCloseDefault(callback:Function, thisObj:any):void;
        onClose(callback:Function, thisObj:any):void;
        chain(identity:string, ...args):IPopup;
        hasChain():boolean;
        forceBackground(v?:boolean):void;

    }

}