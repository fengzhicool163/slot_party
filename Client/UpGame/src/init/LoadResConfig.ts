module init {

    export class LoadResConfig extends BaseInit {

        public constructor() {
            super();
        }

        protected handler_do():void {
            //初始化Resource资源加载库
            //initiate Resource loading library
            //RES.setMaxLoadingThread(1);
            RES.addEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigLoadError, this);
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

            PPGame.Ins.trackEvent(PPTrackEvent.LOADING, PPLoadingStep.MANIFEST_LOAD_BEGIN);

            this.startLoadConfig();
        }

        private startLoadConfig():void {
            // 根据语言环境选择不同的配置文件
            var locale:string = model.LocaleModel.Ins.locale, 
                conf:string = locale == model.LocaleModel.DEFAULT_LOCALE ? 
                    `default.res.json` : `default.res.${locale}.json`;
            RES.loadConfig(RES.getVersionController().getVirtualUrl(
                `resource/${conf}`), 
                `resource/`);
        }

        private onConfigLoadError(event:RES.ResourceEvent):void {
            this.startLoadConfig();
        }

        /**
         * 配置文件加载完成,开始预加载preload资源组。
         * configuration file loading is completed, start to pre-load the preload resource group
         */
        private onConfigComplete(event:RES.ResourceEvent):void {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_LOAD_ERROR, this.onConfigLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);

            PPGame.Ins.trackEvent(PPTrackEvent.LOADING, PPLoadingStep.RES_CONFIG_LOAD);

            this.done();
        }
    }
}