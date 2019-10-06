module init {

    export class LoadAndShowLogin extends BaseInit {

        public constructor() {
            super();
        }

        protected handler_do():void {
            // 首先只加载登陆界面
            var loader:ui.LoadingView = ui.LoadingView.create(false);
            var hasLocale:boolean = false;
            var locale:string = model.LocaleModel.Ins.locale, 
                localeKey:string = 'locale_' + locale;
            // 语言支持依赖于default.res.json文件中的配置，如果没有配置相应的语言资源，就不做支持
            if (RES.hasRes(localeKey)) {
                RES.createGroup(localeKey, [localeKey]);
                hasLocale = true;
            }
            if (hasLocale) {
                loader.queue(localeKey, false, 30);
            }

            loader.queue('slots', true, hasLocale ? 70 : 100);
            loader.setCallback(this.showLogin, this).load();
        }

        private showLogin():void {
            PPGame.Ins.trackEvent(PPTrackEvent.LOADING, PPLoadingStep.LOADING_VIEW_LOAD);

            // 初始化语言模块，需要依赖locale的资源组加载完成
            model.LocaleModel.Ins.init();

            // 先进login界面
            ui.UILayer.Ins.switchStatus(ui.UIStatusIds.LOGIN);
            console.log('[LoadAndShowLogin]', 'ui.UIStatusIds.LOGIN');
            this.done();
        }
    }
}