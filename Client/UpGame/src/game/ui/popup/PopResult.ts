/**
 * Created by zhaikaiyu on 16/12/24.
 */
module ui {

    import MusicManager = game.MusicManager;
    export class PopResult extends BasePopup {
        //private _slot:ui.slots.UI_popup;

        private slotResult;
        private callBack:any;
        private callObj:any;

        private m_win1;
        private m_win2;
        private m_win3;

        private _numberScroller:ui.SlotNumberScroller;

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
            //var stage = ui.UILayer.Ins.stage()
            //stage.addEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
            //this.setBackgrooundAlpha(0.85);
            this.playResultAni();

            // 滚数字
            if (!this._numberScroller) this._numberScroller = new ui.SlotNumberScroller('font1');
            this._numberScroller.x = this.view.width / 2;
            this._numberScroller.y = this.view.height / 2;
            this.view.displayListContainer.addChild(this._numberScroller);
            this._numberScroller.target = this.slotResult;
        }

        protected onBackgroudClose():void {
            this.hide();

        }

        private playResultAni():void{
            this.playAni();
        }

        private win2Complete(target):void{
            var self = this;
            setTimeout(function () {
                self.hide();
                self._numberScroller.current = 0;
            },600)

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
                //this.m_win1 = ui.UIUtils.initStarswfAni("laohujinew001","mc_laohujinew001_win001",win1,true,false);
                //this.m_win2 = ui.UIUtils.initStarswfAni("laohujinew001","mc_laohujinew001_win002",win2,false,false);//掉落钻石
                //this.m_win3 = ui.UIUtils.initStarswfAni("laohujinew003","mc_laohujinew001_win003",win3,false,false);//烟花
                //
                //this.m_win2.removeEventListener(egret.Event.COMPLETE,this.win2Complete,this);
                //this.m_win2.addEventListener(egret.Event.COMPLETE,this.win2Complete,this);
                //
                //this.m_win1.gotoAndPlay(0);
                //this.m_win2.gotoAndPlay(0);
                //this.m_win3.gotoAndPlay(0);
            }


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
            if(this.m_win2){
                this.m_win2.removeEventListener(egret.Event.COMPLETE,this.win2Complete,this);
                this.removeTarget(this.m_win2);
            }
            if(this.m_win3)
                this.removeTarget(this.m_win3);

            super.onHide();

            //var stage = ui.UILayer.Ins.stage()
            //stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchHandler,this);
            if(this.callBack){
                this.callBack.apply(this.callObj);
            }

        }

    }

}