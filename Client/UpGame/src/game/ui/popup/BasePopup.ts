/**
 * Created by huangqingfeng on 16/4/26.
 */

module ui {

    /*
    * 弹窗基类，处理一些共性的逻辑
    * */
    export class BasePopup extends fairygui.Window implements ui.IPopup {

        private __loaded:boolean = false;
        private __added:boolean = false;

        private _resGroup:string;
        private _fguiItemName:string;
        protected _requestFull:boolean = false;
        private _fguiPackage:string;

        // 主要用来提供给PopupLayer,关闭的时候回调来统计是否需要去除底下的黑色背景
        private _defaultCloseCallback:Function;
        private _defaultCloseCallbackObj:any;

        private _updateCalledBeforeLoaded:boolean = false;
        private _updateArgs:any[];

        private _closeText:fairygui.GObject;

        protected _closeCallbacks:any[];
        protected _popupChain:any[];
        protected _needFocusWhenShow:boolean = false;

        protected _backgroundAlpha:number = 0.7;

        public constructor(resGroup:string, fguiItemName:string, requestFull:boolean = false, fguiPackage:string = null) {
            super();

            this._resGroup = resGroup;
            this._fguiItemName = fguiItemName;
            this._requestFull = requestFull;
            this._fguiPackage = fguiPackage || this._resGroup;

            ui.UIUtils.lifeTime(this, this.__onAdded, this.__onRemoved, this, true);

            this.initPopup();
        }

        protected initPopup():void {
            // 进入锁定状态
            game.GameEvent.UI_LOADING_LOCK.dispatch(true);
            this.load();
        }

        protected load():void {
            if (!this.resourceLoaded()) {
                // 加载器
                var loader:LoadingView = this.createLoader();
                if (loader) loader.load();
                else this.create();
            } else {
                this.create();
            }
        }

        private resourceLoaded():boolean {
            var url:string = !this._resGroup && !this._fguiItemName ? fairygui.UIPackage.getItemURL(this._resGroup, this._name) : null;
            return !!url && url.length > 0;
        }

        protected createLoader():LoadingView {
            if (this._resGroup) {
                var loader:LoadingView =
                    LoadingView.create()
                        .queue(this._resGroup)
                        .setCallback(this.create, this);
                return loader;
            }
            return null;
        }

        protected create():void {
            if (this._fguiPackage && this._fguiItemName)
                this.contentPane = fairygui.UIPackage.createObject(this._fguiPackage, this._fguiItemName).asCom;

            // 取消加载锁定
            game.GameEvent.UI_LOADING_LOCK.dispatch(false);

            this.__loaded = true;
            this.tryUpdate();
        }

        private __onAdded():void {
            this.__added = true;
            this.tryUpdate();
        }

        public hasLoaded():boolean {
            return this.__loaded;
        }

        public setNeedFocusWhenShow(value:boolean):void {
            this._needFocusWhenShow = value;
        }

        public closeWhenClickOutside():boolean {
            return true;
        }

        protected tryUpdate():void {
            if (!this._updateCalledBeforeLoaded || !this.__loaded || !this.__added) return;

            this._beforeOnUpdate();
            this.onUpdate.apply(this, this._updateArgs);
            this._afterOnUpdate();

            this._updateArgs = null;
            this._updateCalledBeforeLoaded = false;
        }

        /*
        * 获取显示对象用这个
        * */
        public get view():fairygui.GComponent {
            return this.contentPane;
        }

        /*
        * 此方法不要覆写,需要更新的话覆写onUpdate方法
        * */
        public update(...args):void {
            this._updateCalledBeforeLoaded = true;
            this._updateArgs = args;

            this.tryUpdate();
        }

        private _beforeOnUpdate():void {
            if (this._requestFull) {
                this.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
            }
            this.center();
            if (!!this.view) {
                if (this._requestFull) {
                    this.view.setSize(fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
                }
                this.view.center();
                ui.UIUtils.iterGLoader(this.view, this.onLoaderNeedToDealWith, this);
            }

            this.showBackground();
        }

        private _afterOnUpdate():void {
            if (!!this.view) this._closeText = this.view.getChild('kongbai');
            if (!!this._closeText) {
                console.log(`[BasePopup] 有点击空白处关闭`);
                this._closeText.addClickListener(this.hide, this);
            }
        }

        /*
        * 更新界面覆写此方法
        * */
        protected onUpdate(...args):void {

        }

        /*
        * 如果覆写这个方法,需要注意:
        * 这里的参数是当前弹窗里面过滤出来的一个个的GLoader.
        * 假如找到的GLoader自己要单独处理,不用它本身的命名去加载,就返回false.
        * 否则就是采用默认逻辑,也就是根据名字去加载,那么就返回true.
        * */
        protected onLoaderNeedToDealWith(loader:fairygui.GLoader):boolean {
            return true;
        }

        public onCloseDefault(callback:Function, thisObj:any):void {
            this._defaultCloseCallback = callback;
            this._defaultCloseCallbackObj = thisObj;
        }

        /*
        * 关闭回调,这是一个入栈的操作,堆叠的回调方法会先进先出的回调到.
        * */
        public onClose(callback:Function, thisObj:any):void {
            if (!this._closeCallbacks) this._closeCallbacks = [];
            var stack:any = {cb: callback, cbObj: thisObj};
            var same:any = _.findWhere(this._closeCallbacks, stack);
            if (!same) {
                this._closeCallbacks.push(stack);
            }
        }

        private __onRemoved():void {
            if (this._popupChain && this._popupChain.length) {
                // 处理后续弹窗
                this.onChainClose();
            } else {
                this.releaseCloseCallbacks();
                if (!!this._closeText) {
                    this._closeText.removeClickListener(this.hide, this);
                }
            }
        }

        /*
        * 如果有连锁弹窗,这在里循环处理
        * */
        private onChainClose(...args):void {
            if (this._popupChain && this._popupChain.length) {
                var args:any[] = this._popupChain.shift();
                var iPopup:ui.IPopup = ui.UILayer.Ins.popup.apply(ui.UILayer.Ins, args);
                if (iPopup) {
                    iPopup.onClose(this.onChainClose, this);
                }
            } else {
                this.releaseCloseCallbacks();
            }
        }

        /*
        * 兑现所有关闭回调方法
        * */
        protected releaseCloseCallbacks():void {
            // 先处理默认回调
            if (this._defaultCloseCallback) {
                if (this._defaultCloseCallback.length)
                    this._defaultCloseCallback.call(this._defaultCloseCallbackObj, this);
                else
                    this._defaultCloseCallback.call(this._defaultCloseCallbackObj);
            }
            // 再处理用户回调
            if (this._closeCallbacks && this._closeCallbacks.length) {
                while (this._closeCallbacks.length) {
                    var stack:any = this._closeCallbacks.shift();
                    stack.cb.apply(stack.cbObj);
                }
            }
        }

        /*
        * 给后续弹窗增加连锁关联
        * */
        public chain(identity:string, ...args):IPopup {
            if (!this._popupChain) this._popupChain = [];
            args.unshift(identity);
            this._popupChain.push(args);
            return this;
        }

        /*
        * 是否还有连锁弹窗
        * */
        public hasChain():boolean {
            return this._popupChain && this._popupChain.length > 0;
        }

        public requestFocus():void {
            if (!this._needFocusWhenShow) return;

            super.requestFocus();
        }

        /*
         * 半透黑背景
         * */
        private __graph:fairygui.GGraph;
        private __graphComp:fairygui.GComponent;
        /*
        * 强制显示一个黑背景在后面
        * */
        public forceBackground(v:boolean = true):void {
            return;
            // this.__isForcedShowBackground = v;

            // if (this.__added && this.__loaded && this.__isForcedShowBackground)
            //     this.showBackground();
        }

        protected setBackgrooundAlpha(alpha){
            if(this.__graph){
                //this.__graph.alpha = alpha;
                this.__graph.clearGraphics();
                this.__graph.drawRect(1, 0, 0, 0, alpha);
            }
        }

        protected showBackground():void {
            if (!this.__graph) {
                this.__graph = new fairygui.GGraph();
                this.__graph.drawRect(1, 0, 0, 0, 0.7);
            }
            if (!this.__graphComp) {
                this.__graphComp = new fairygui.GComponent();
                this.__graphComp.addChild(this.__graph);
                this.__graph.addRelation(this.__graphComp, fairygui.RelationType.Size);
            }
            this.__graphComp.setSize(UILayer.ACTUAL_WIDTH, UILayer.ACTUAL_HEIGHT);
            this.addChildAt(this.__graphComp, 0);
            // console.log('[BasePopup]', 'debug', UILayer.ACTUAL_WIDTH, UILayer.ACTUAL_HEIGHT,
            //     this.width, this.height,
            //     this.view.width, this.view.height,
            //     this.x, this.y,
            //     this.view.x, this.view.y);
            this.__graphComp.center(true);
            // this.__graphComp.x = (this.width - this.__graph.width) / 2;
            // this.__graphComp.y = (this.height - this.__graph.height) / 2;
            // var globalPos:egret.Point = this.localToGlobal();
            // console.log('[BasePopup]', 'debug', globalPos);
            // this.__graphComp.x = -globalPos.x;
            // this.__graphComp.y = -globalPos.y;
            ui.UIUtils.lifeTime(this.__graphComp, this.onShowingBackground, this.onHideBackground, this, true);
        }

        protected hideBackground():void {
            this.onHideBackground();
        }

        private onShowingBackground():void {
            this.__graphComp.addClickListener(this.onBackgroudClose, this);
        }

        private onHideBackground():void {
            this.__graphComp.removeFromParent();
            this.__graphComp.removeClickListener(this.onBackgroudClose, this);
        }

        protected onBackgroudClose():void {
            // console.log('[BasePopup]', 'debug', 'onBackgroudClose');
            this.hide();
        }

    }

}