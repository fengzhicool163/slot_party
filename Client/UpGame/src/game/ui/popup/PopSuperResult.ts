/**
 * Created by zhaikaiyu on 16/12/24.
 */
module ui {

    import MusicManager = game.MusicManager;
    export class PopSuperResult extends BasePopup {
        //private _slot:ui.slots.UI_popup;

        private slotResult;
        private callBack:any;
        private callObj:any;

        private m_win1;
        private m_win2;
        private m_win3;
        private m_win4;
        private m_win5;
        private m_win6;
        private m_win7;

        public constructor() {
            super('slots', 'popup');

            //this._slot = ui.slots.UI_popup.createInstance();
        }


        protected onUpdate(...args):void {
            this.slotResult = args[0];
            this.callBack = args[1];
            this.callObj = args[2];

            if(0){
                MusicManager.Ins.play("shengli_mp3")
            }
            var stage = ui.UILayer.Ins.stage()
            stage.addEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
            //this.setBackgrooundAlpha(0.85);
            this.playResultAni();
        }

        protected onBackgroudClose():void {
            this.play004Ani();

        }

        private touchHandler(evt: egret.TouchEvent): void {
            this.play004Ani();
        }

        private playResultAni():void{
            this.playAni();
        }

        private win5Complete(target):void{

            //if(this.quality != 1){//自动关闭
            //    var self = this;
            //    setTimeout(function () {
            //        self.hide();
            //    },1500)
            //
            //}else{
            //
            //}

            this.playWin7();
        }

        private playWin7():void{
            var win7 = this.view.getChild("win7").asGraph;
            this.m_win7 = ui.UIUtils.initStarswfAni("laohujinew004","mc_laohujinew001xxg_win007",win7,false,false);//跳钻石
            this.m_win7.gotoAndPlay(0);
        }
        private playAni():void{
            var win1 = this.view.getChild("win1").asGraph;
            var win2 = this.view.getChild("win2").asGraph;
            var win3 = this.view.getChild("win3").asGraph;
            var win4 = this.view.getChild("win4").asGraph;
            var win5 = this.view.getChild("win5").asGraph;
            var win6 = this.view.getChild("win6").asGraph;
            var win7 = this.view.getChild("win7").asGraph;


            if(1){
                //this.m_win3 = ui.UIUtils.initStarswfAni("laohujinew003","mc_laohujinew001_win003",win3,true,true);//烟花
                this.m_win4 = ui.UIUtils.initStarswfAni("laohujinew002","mc_laohujinew001yc_win004",win4,false,false);//波纹光
                this.m_win5 = ui.UIUtils.initStarswfAni("laohujinew005","mc_laohujinew001xxg_win008",win5,false,false);
                this.m_win6 = ui.UIUtils.initStarswfAni("laohujinew002","mc_laohujinew001yc_win006",win6,false,false);//闪光

                this.m_win4.gotoAndPlay(0);
                this.m_win5.gotoAndPlay(0);
                this.m_win6.gotoAndPlay(0);

            }



            if(this.m_win5){
                var spr = this.m_win5.getSprite("wenzi");
                if(spr){
                    var text = spr.getChildByName("labelTxt");
                    if(!text){
                        text = new egret.TextField();
                        text.size = 45;
                        text.textColor = 0xffffff;
                        text.width = 180;
                        text.textAlign = egret.HorizontalAlign.CENTER;
                        spr.addChild(text);
                        text.name = "labelTxt";
                    }
                    text.text = this.slotResult;
                }

                this.m_win5.removeEventListener(egret.Event.COMPLETE,this.win5Complete,this);
                this.m_win5.addEventListener(egret.Event.COMPLETE,this.win5Complete,this);
            }


        }

        private play004Ani():void{
            this.hide();

        }

        private removeTarget(target):void{
            if(target && target.parent){
                target.stop();
                target.parent.removeChild(target);
            }
        }

        public onHide():void {
            if(this.m_win1)
                this.removeTarget(this.m_win1);
            if(this.m_win2)
                this.removeTarget(this.m_win2);
            if(this.m_win3)
                this.removeTarget(this.m_win3);
            if(this.m_win4)
                this.removeTarget(this.m_win4);
            if(this.m_win5)
                this.removeTarget(this.m_win5);
            if(this.m_win6)
                this.removeTarget(this.m_win6);
            if(this.m_win7)
                this.removeTarget(this.m_win7);

            super.onHide();

            var stage = ui.UILayer.Ins.stage()
            stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
            if(this.callBack){
                this.callBack.apply(this.callObj);
            }

        }

    }

}