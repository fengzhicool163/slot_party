module view {

    /*
    * 启动/停止全屏特效
    */
    export class RateScreenEffect {

        private static _ins:RateScreenEffect;
        public static get Ins():RateScreenEffect {
            if (this._ins == null) this._ins = new RateScreenEffect();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;
        private _animation:game.Animation;

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {
            game.UIEvent.MULTI_RATE_START.add(this.onStart, this);
            game.UIEvent.MULTI_RATE_STOP.add(this.onStop, this);

            if (model.UserModel.Ins.taskTimes > 0) {
                this.onStart();
            }
        }

        private onStart():void {
            var self = this;
            game.AssetManager.Ins.loadAssets(["beilv_swf_json","beilv_json"],function(data){
                if (model.UserModel.Ins.taskTimes == 0) {
                    return;
                }
                self._animation = game.Animation.get("beilv", `mc_beilv_kuang`)
                    .attach(self._slot.m_chushuzi02)
                    .fitScale()
                    .onStop(false)
                    .play(true);

                self._slot.m_chushuzi02.visible = true;

            },this)


        }

        private onStop():void {
            if (!!this._animation) {
                this._animation.stop();
            }
            this._slot.m_chushuzi02.visible = false;
        }

    }

}