module view {

    /*
    * 倍率玩法进度条
    */
    export class RateBar {

        private static _ins:RateBar;
        public static get Ins():RateBar {
            if (this._ins == null) this._ins = new RateBar();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;


        private _collectingAni1:game.Animation= null;
        private _collectingAni2:game.Animation= null;
        private _collectingAni3:game.Animation= null;

        private _ani:starlingswf.SwfMovieClip;


        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {
            game.UIEvent.MULTI_RATE_START.add(this.update, this);
            game.UIEvent.MULTI_RATE_STOP.add(this.update, this);
            game.UIEvent.SLOT_COMPLETE.add(this.update, this);
            game.UIEvent.UPDATA_RATE.add(this.update, this);
            game.UIEvent.SHOW_FREE_TIMES.add(this.onFreeTimes, this);


            this.update();

        }

        private onFreeTimes(freeTimes:number):void {
            //return;
            if(freeTimes == 0){
                return;
            }

            var self = this;

            game.AssetManager.Ins.loadAssets(["laohujinew003_json","laohujinew003_swf_json"],function(data){
                var animation:game.Animation =
                    game.Animation.get("laohujinew003","mc_laohujinew001_chushuzi01")
                        .attach(self._slot.m_chushuzi01)
                        .fitScale()
                        .onStop(true, function ():void {
                            var timeout:number = setTimeout(function() {
                                clearTimeout(timeout);
                                animation.stop();
                            }, 1000);
                        })
                        .play(false);

                var spr:starlingswf.SwfSprite = animation.anim.getSprite('wenzi');
                var tf:egret.BitmapText = new egret.BitmapText();
                tf.letterSpacing = -40;
                tf.font = RES.getRes('font1');
                tf.text = freeTimes + '';
                tf.y = -20;
                spr.addChild(tf);


            },this)



            //this.update();
        }

        private update():void {
            var rate = this._slot.m_n223;
            var rateShow = model.UserModel.Ins.taskTimes>0?true:false;
            rate.visible = rateShow;

            rate.m_n191.asTextField.text = '' + model.UserModel.Ins.taskRate;
            rate.m_n194.asTextField.text = '' + model.UserModel.Ins.taskTimes;

        }




    }

}