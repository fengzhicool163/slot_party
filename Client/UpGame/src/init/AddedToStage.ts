module init {

    export class AddedToStage extends BaseInit {

        public constructor() {
            super();
        }

        protected handler_do():void {
            ui.UIUtils.lifeTime(
                Main.Inst, 
                function ():void {
                    this.onAddedToStage();
                }, 
                null, 
                this, 
                true);
        }

        private onAddedToStage():void {
            egret.ImageLoader.crossOrigin = 'Anonymous';

            game.MusicManager.Ins.initGameSettings();

            WindowMsg.Ins.startListen();

            if (egret.Capabilities.runtimeType == egret.RuntimeType.WEB) {
                // 注册Web的resource管理器
                RES.registerVersionController(new game.WebVersionController());
            }

            // 初始化fgui相关
            ui.FGUIExtension.init();

            ui.UILayer.Ins.init(Main.Inst.stage);

            model.ErrorAction.initActionMap();

            this.done();
        }
    }
}