module view {

    export class SlotJackpot {
        private test:number = 0;
        private slotJackpotNumber :ui.SlotJackpotNumber;
        private  _isJackpot:boolean = false;
        private static _ins:SlotJackpot;
        private _timer:number = 0;

        public static get Ins():SlotJackpot {
            if (this._ins == null) this._ins = new SlotJackpot();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {

            //test
            //this.slotJackpotNumber = new ui.SlotJackpotNumber(this._slot.m_n203);
            this.slotJackpotNumber.onStop(this.onnumberScroller, this);

            //var timeout = new egret.Timer(5000);
            //timeout.addEventListener(egret.TimerEvent.TIMER, this.timeoutFunc, this);
            //timeout.start();
            game.UIEvent.SHOW_SUPPLEMENT_ANI.add(this.supplementPlay, this);
            game.UIEvent.SHOW_STOP_JACKPOT_NUM.add(this.stopJackpotNum, this);
            this.getJackPot();
        }

        //private timeoutFunc():void {
        //    console.log('[SlotJackpot]   timeoutFunc');
        //    var value = this.slotJackpotNumber.current + 12345;
        //    this.slotJackpotNumber.target = value;
        //}
        private supplementPlay():void {
            this.slotJackpotNumber.startVScroll();

        }

        private stopJackpotNum():void {
            this.stopTimer();
            this.slotJackpotNumber.stop2();

        }

        private onnumberScroller(time:any):void {
            //this.slotJackpotNumber.startVScroll();
            //return;

            var jnt = this.slotJackpotNumber.getScrollerTime();
            var newtime = time>0?1:jnt;
            var self = this;
            this._timer = setTimeout(function() {
                self.stopTimer();
                self.getJackPot();
            }, jnt*1000);

        }

        private stopTimer():void {
            if(this._timer){
                clearTimeout(this._timer);
                this._timer = 0;
            }
        }

        private getJackPot():void{
            model.UserModel.Ins.getQueryJackPot(this.getJackPotSuccess, this.getJackPotFail, this);
        }


        private getJackPotSuccess(result:any):void{
            var value = result.diamond;//this.slotJackpotNumber.current + 12345;
            if(this._isJackpot == false){
                this.slotJackpotNumber.current = value;
                this._isJackpot = true;
            }
            this.slotJackpotNumber.target = value;
        }
        private getJackPotFail(result:any):void{
            var self = this;
            var timeout = setTimeout(function() {
                self.getJackPot();
            }, 10000);
        }
    }

}