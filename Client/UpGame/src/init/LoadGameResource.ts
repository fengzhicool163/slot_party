module init {

    export class LoadGameResource extends BaseInit {

        /*
        * 预加载队列
        * */
        public static LOADING_GROUPS:any[] = [
            // {group:'preload', isUI:false, weight:50},
            {group:'first_page', isUI:true, weight:90},
        ];

        public constructor() {
            super();
        }

        protected handler_do():void {
            // 默认不显示文字,因为这里要用登陆界面的文字代替
            var loading:ui.LoadingView = ui.LoadingView.create(false),
                conf:any;
            // 队列加载
            while (LoadGameResource.LOADING_GROUPS.length) {
                conf = LoadGameResource.LOADING_GROUPS.shift();
                loading.queue(conf.group, conf.isUI, conf.weight);
            }
            // 设置进度回调
            loading.setUpdateCallback(function (progress:number):void {
                game.GameEvent.PRELOADING_PROGRESS.dispatch(progress);
            }, this);
            // 设置完成回调
            loading.setCallback(function ():void {
                this.onComplete();
            }, this);
            // 启动!
            loading.load();
        }

        private onComplete():void {
            // 配置文件进内存
            //fightClient.util.loadGameConfig(model.LocalConfigModel.Ins.gameConfig);

            PPGame.Ins.trackEvent(PPTrackEvent.LOADING, PPLoadingStep.RES_LOAD);

            this.done();
        }
    }
}