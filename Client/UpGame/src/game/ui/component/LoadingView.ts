/**
 * Created by huangqingfeng on 16/5/6.
 */
module ui {

    /*
    * 代理类,用来动态加载FairyGUI写的需要动态加载资源包的界面.
    * 比如现在的弹窗类,全都是动态加载包资源的.
    * */
    export class LoadingView {

        private _showLoading:boolean = true;
        private _lock:boolean = true;
        private _totalWeight:number = 0;
        private _queue:any[];
        private _currentToLoad:any;
        private _callback:Function;
        private _context:any;
        private _onUpdateCallback:Function;
        private _onUpdateCallbackObj:any;

        private _fguiDefsToUpdate:string[];

        public constructor(showLoading:boolean = true, lock:boolean = false) {
            this._showLoading = showLoading;
            this._lock = lock;
            this._totalWeight = 0;
            this._queue = [];
            this._fguiDefsToUpdate = [];
        }

        /*
        * 创建一个loadingview
        * */
        public static create(showLoading:boolean = true, lock:boolean = true):LoadingView {
            return new LoadingView(showLoading, lock);
        }

        /*
        * 添加素材
        * */
        public queue(group:string, isUIAssets:boolean = true, weight:number = 100):LoadingView {
            var has:any = _.findWhere(this._queue, {group:group});
            if (!has) {
                this._queue.push({group: group, weight: weight, isUIAsset: isUIAssets});
            }
            return this;
        }

        /*
        * 进度回调
        * */
        public setUpdateCallback(onUpdate:Function, context?:any):LoadingView {
            this._onUpdateCallback = onUpdate;
            this._onUpdateCallbackObj = context;
            return this;
        }

        /*
        * 完成回调
        * */
        public setCallback(callback?:Function, context?:any):LoadingView {
            this._callback = callback;
            this._context = context;

            return this;
        }

        /*
        * 开始加载
        * */
        public load():LoadingView {
            this._showLoadingUI();
            this.loadNext();
            return this;
        }

        private loadNext():void {
            if (this._queue.length > 0) {
                this._currentToLoad = this._queue.shift();
                if (this._currentToLoad) {
                    GroupLoader.Inst.load(this._currentToLoad.group, this.onGroupProgress, this.onGroupComplete, this);
                }
            } else {
                this.onAllComplete();
            }
        }

        private onGroupProgress(e:RES.ResourceEvent):void {
            var weight:number = this._currentToLoad.weight,
                progress:number = Math.ceil(e.itemsLoaded / e.itemsTotal * weight + this._totalWeight);
            // console.log(`[LoadingView] 进度 ${progress}`);
            if (this._showLoading) {
                game.GameEvent.SHOW_PROGRESS_LOADING.dispatch(true, progress);
            }

            if (e.resItem.type === 'bin' && this._currentToLoad.isUIAsset) {
                // 单个加载完成,判断是不是应该用fgui处理一下
                // console.log(`[LoadingView] 新增UI包 ${e.resItem.name}`);
                this._fguiDefsToUpdate.push(e.resItem.name);
            }

            if (!!this._onUpdateCallback) this._onUpdateCallback.apply(this._onUpdateCallbackObj, [progress]);
        }

        private onGroupComplete(e:RES.ResourceEvent):void {
            // console.log(`[LoadingView] 加载完成 ${e.groupName}`);
            this._totalWeight += this._currentToLoad.weight;
            this.loadNext();
        }

        private onAllComplete():void {
            while (this._fguiDefsToUpdate.length) {
                var n:string = this._fguiDefsToUpdate.shift();
                // console.log(`[LoadingView] 添加UI包 ${n}`);
                fairygui.UIPackage.addPackage(n);
            }

            if (this._callback) this._callback.apply(this._context);

            this._callback = null;
            this._context = null;
            this._onUpdateCallback = null;
            this._onUpdateCallbackObj = null;

            this._hideLoadingUI();
        }

        private _showLoadingUI():void {
            if (!this._showLoading) return;
            game.GameEvent.LOCK_SCREEN.dispatch(true);
            game.GameEvent.SHOW_PROGRESS_LOADING.dispatch(true, 0);
        }

        private _hideLoadingUI():void {
            game.GameEvent.LOCK_SCREEN.dispatch(false);
            game.GameEvent.SHOW_PROGRESS_LOADING.dispatch(false);
        }

    }

    export class GroupLoader {

        private static _ins:GroupLoader;
        public static get Inst():GroupLoader {
            if (!GroupLoader._ins) GroupLoader._ins = new GroupLoader();
            return GroupLoader._ins;
        }

        private static MAX_TRY:number = 3;

        private _queueArr:any[] = [];
        private _queueDict:any = {};

        private _current:any;

        public load(group:string, onProgress:Function, onComplete:Function, context:any):void {
            var has:boolean = true;

            group = this.groupMapping(group);

            if (!this._queueDict.hasOwnProperty(group)) {
                this._queueDict[group] = [];
                has = false;
            }
            var item:any = {group: group, progress: onProgress, complete: onComplete, context: context};
            this._queueDict[group].push(item);
            if (!has) {
                item = {group: group, retry: 0};
                this._queueArr.push(item);
            }
            this.loadNext();
        }

        private groupMapping(group:string):string {
            var toLoadGroup:string = group;

            // 多语言支持
            if (model.LocaleModel.Ins.locale != model.LocaleModel.DEFAULT_LOCALE) {
                var locale:string = model.LocaleModel.Ins.locale, 
                    currGroup:string = group, 
                    requireUpdateToLocale:boolean = true,
                    localeGroup:string = group + '_' + locale;

                if (currGroup.indexOf(locale) != -1) 
                    requireUpdateToLocale = false;

                if (requireUpdateToLocale) {
                    // 判断是否已有对应的多语言资源组
                    var localeGroupItems:RES.ResourceItem[] = RES.getGroupByName(localeGroup);
                    if (localeGroupItems && localeGroupItems.length > 0) 
                        requireUpdateToLocale = false;
                }

                if (requireUpdateToLocale) {
                    var items:RES.ResourceItem[] = RES.getGroupByName(group);
                    if (items && items.length > 0) {
                        var item:RES.ResourceItem, 
                            itemName:string, 
                            localeItemName:string, 
                            localeItem:RES.ResourceItem, 
                            newGroupNames:string[] = [];
                        for (var i:number = 0; i < items.length; i ++) {
                            item = items[i];
                            if (item) {
                                itemName = item.name;
                                if (itemName.indexOf('@') != -1) {
                                    var splits:string[] = itemName.split('@');
                                    splits[0] = splits[0] + '_' + locale;
                                    localeItemName = splits.join('@');
                                } else {
                                    localeItemName = itemName + '_' + locale;
                                }
                                if (RES.hasRes(localeItemName)) {
                                    // 说明有多语言版本的资源配置
                                    newGroupNames.push(localeItemName);
                                } else {
                                    newGroupNames.push(itemName);
                                }
                            }
                        }
                        // 创建新的多语言资源组
                        RES.createGroup(
                            localeGroup, 
                            newGroupNames, 
                            true);

                        toLoadGroup = localeGroup;
                        // console.log('[Loader]', 'mapping', toLoadGroup, currGroup, newGroupNames);
                    }
                }
            }
            return toLoadGroup;
        }

        private loadNext():void {
            if (!this._current) {
                if (this._queueArr.length > 0) {
                    this._current = this._queueArr.shift();

                    this._current.retry = 0;

                    RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onGroupLoadComplete, this);
                    RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this._onGroupProgress, this);
                    RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this._onGroupLoadError, this);
                    RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this._onItemLoadError, this);
                    // console.log('[Loader]', '加载组：', toLoadGroup);
                    RES.loadGroup(this._current.group);
                } else {
                    RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this._onGroupLoadComplete, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this._onGroupProgress, this);
                    RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this._onGroupLoadError, this);
                    RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this._onItemLoadError, this);
                }
            }
        }

        private _onGroupLoadComplete(e:RES.ResourceEvent):void {
            // console.log('[Loader]', '加载完成：', e.groupName, this._mappedGroupName[e.groupName]);
            var actualGroup:string = e.groupName;
            var g:any[] = this._queueDict[actualGroup],
                item:any;
            if (g && g.length > 0) {
                delete this._queueDict[actualGroup];
                this._current = null;

                for (var i:number = 0, len:number = g.length; i < len; i++) {
                    item = g[i];
                    if (item && item.complete) {
                        item.complete.apply(item.context, [e]);
                    }
                }
            }
            this.loadNext();
        }

        private _onGroupProgress(e:RES.ResourceEvent):void {
            var actualGroup:string = e.groupName;
            var g:any[] = this._queueDict[actualGroup],
                item:any;
            for (var i:number = 0, len:number = g.length; i < len; i ++) {
                item = g[i];
                if (item && item.progress) {
                    item.progress.apply(item.context, [e]);
                }
            }
        }

        private _onGroupLoadError(e:RES.ResourceEvent):void {
            //重试加载
            console.log('retry load group ' + e.groupName);
            var actualGroup:string = e.groupName;
            var g:any = this._queueDict[actualGroup];
            if (g) {
                g.retry ++;
                if (g.retry < GroupLoader.MAX_TRY)
                    RES.loadGroup(actualGroup);
                else {
                    this.retry(actualGroup);
                }
            }
        }

        private _onItemLoadError(e:RES.ResourceEvent):void {
            console.log('item load error ', e);
        }

        private retry(group:string):void {
            var g:any = this._queueDict[group];
            if (g) {
                var conf:any = {
                    showClose: false,
                    content: game.Tools.lang('資源加載失敗,點擊確定重試!!'),
                    confirmCallback: function ():void {
                        g.retry = 0;
                        RES.loadGroup(group);
                    },
                    confirmCallbackObj: this
                };
                ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION, conf);
            }
        }

    }
}