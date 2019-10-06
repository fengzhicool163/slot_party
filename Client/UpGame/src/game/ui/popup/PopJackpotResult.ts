/**
 * Created by zhaikaiyu on 16/12/24.
 */
module ui {

    import MusicManager = game.MusicManager;
    export class PopJackpotResult extends BasePopup {


        private slotResult:any;
        private callBack:any;
        private callObj:any;

        private _slot:any;
        private _animation:game.Animation;

        public constructor() {
            super('slots', 'popup');

        }


        protected onUpdate(...args):void {
            this._slot = args[0];
            this.slotResult = args[1];
            this.callBack = args[2];
            this.callObj = args[3];

            var stage = ui.UILayer.Ins.stage()
            stage.addEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
            this.setBackgrooundAlpha(0);
            this.playAni();
        }

        protected onBackgroudClose():void {
            this.hide();
        }

        private touchHandler(evt: egret.TouchEvent): void {
            this.onBackgroudClose();
        }

        private playAni():void{
            var graph:fairygui.GGraph = new fairygui.GGraph();
            var self = this;
            self.view.addChild(graph);
            this._animation =
                game.Animation.get("laohujinew003", "mc_laohujinew001xxg_tonggao")
                    .attach(graph)
                    .onStop(false)
                    .play(false);

            var ani = this._animation.anim;
            var spr = ani.getSprite("zhanwei");

            if(spr){
                spr.removeChildren();

                var view:fairygui.GComponent = fairygui.UIPackage.createObject('slots', 'player_info').asCom;
                var w = view.width;
                var h = view.height;
                view.x = -w/2;
                view.y = -h/2;
                view.getChild('n66').asTextField.text = game.Tools.lang(this.slotResult.username);
                view.getChild('n69').asTextField.text = '' + this.slotResult.diamond;

                var units = view.getChild('n65').asCom.getChild('n34').asCom;
                ui.UIUtils.fitPlayerHead(units, this.slotResult.avatar);

                spr.addChild(view.displayObject);
            }
        }


        private removeTarget(target):void{
            if(target && target.parent){
                target.stop();
                target.parent.removeChild(target);
            }
        }

        public onHide():void {
            super.onHide();

            var stage = ui.UILayer.Ins.stage()
            stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
            if(this.callBack){
                this.callBack.apply(this.callObj);
            }

        }

    }

}