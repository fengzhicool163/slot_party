module view {

    export class SlotBtn {

        private static _ins:SlotBtn;
        public static get Ins():SlotBtn {
            if (this._ins == null) this._ins = new SlotBtn();
            return this._ins;
        }

        private static LONG_PRESS_TIME_IN_MS:number = 1000;
        private static PAYED_AUTO_LIMIT:number = 100;

        private _slot:ui.slots.UI_slots;
        private _isAuto:boolean = false;
        private _running:boolean = false;
        private _timeoutId:number = -1;
        private _bet:number = 20;
        private _line:number = 9;
        private _singleBet:number = 180;
        private _lastFreeTimes:number = 0;
        private _payedAutoLimit:number = 0;

        get running():boolean {
            return this._running;
        }

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        set auto(value:boolean) {
            this._isAuto = value;

            if (!this._isAuto) this._payedAutoLimit = 0;

            this._slot.m_n9.getControllerAt(0).selectedIndex = this._isAuto ? 1 : 0;
        }

        private onBet(bet:any):void {
            this._bet = parseInt(bet);

            this._singleBet = this._bet * this._line;
        }

        private onLine(line:any):void {
            this._line = parseInt(line);

            this._singleBet = this._bet * this._line;
        }

        get auto():boolean {
            return this._isAuto;
        }

        private doLogic():void {
            game.UIEvent.SLOT_COMPLETE.add(this.onSlotComplete, this);
            game.UIEvent.SLOT_STOP_AUTO.add(this.stopAuto, this);
            game.UIEvent.BET.add(this.onBet, this);
            game.UIEvent.LINE.add(this.onLine, this);

            this._slot.m_n9.addClickListener(this.onClick, this);

            this._slot.m_n9.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchHandler,this);
            this._slot.m_n9.addEventListener(egret.TouchEvent.TOUCH_END, this.touchHandler,this);
            this._slot.m_n9.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.touchHandler,this);
            this._slot.m_n9.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchHandler,this);


            // 特效
            var jiantou = this._slot.m_n9.m_jiantou;
            var m_jiantou = ui.UIUtils.initStarswfAni("laohujinew005","mc_laohujinewxxg_jiantou",jiantou,true,false);

            this.auto = false;
        }

        private onSlotComplete():void {
            this._running = false;
            this.displayArrow(true);
            if (this.auto) {
                if (this._lastFreeTimes > model.UserModel.Ins.freeTimes && model.UserModel.Ins.freeTimes == 0) {
                    this.auto = false;
                } 

                if (this._payedAutoLimit >= SlotBtn.PAYED_AUTO_LIMIT) {
                    this.auto = false;
                }

                if (this.auto) {
                    this.onRun();
                }
            }
        }

        private onAutoRun():void {
            this.auto = true;
            this.onRun();
        }

        private onRun():void {
            if (this._running) {
                console.log('[SlotBtn]', 'running, can not start');
                return;
            }
//活动结束后,取消自动状态,并弹出提示框,终止事件.
            if(model.UserModel.Ins.getIsClosed())
            {
                ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION, {
                    content: game.Tools.lang('活動已結束!'),
                });

                if (this._timeoutId != -1) {
                    clearTimeout(this._timeoutId);
                    this._timeoutId = -1;
                    if (this.auto) this.auto = false;
                    return;
                }

                return;
            }

            var freeTimes:number = model.UserModel.Ins.freeTimes;

            if (freeTimes <= 0 && !model.UserModel.Ins.isEnough(this._singleBet, 'diamond')) return;

            this._lastFreeTimes = freeTimes;

            if (this.auto && this._lastFreeTimes <= 0) {
                this._payedAutoLimit ++;
            }

            console.log('[SlotBtn]', 'slot', `auto: ${this.auto}, timeoutId: ${this._timeoutId}`);
            this._running = true;

            game.UIEvent.SLOT.dispatch(this.auto, this._lastFreeTimes > 0);

            //点击动画
            this.displayTouch();
            this.displayArrow(false);
        }

        private stopAuto():void{
            if (this._timeoutId != -1) {
                clearTimeout(this._timeoutId);
                this._timeoutId = -1;
                if (this.auto) this.auto = false;
            }
        }

        private onClick():void {
            //game.UIEvent.UPDATE_JACKPOT_LIST.dispatch(1);
            //return;
            console.log('[SlotBtn]', 'click', `auto: ${this.auto}, timeoutId: ${this._timeoutId}`);
            if (this._timeoutId != -1) {
                clearTimeout(this._timeoutId);
                this._timeoutId = -1;
                if (this.auto) this.auto = false;
                return;
            }
            if (this.auto) this.auto = false;
            else this.onRun();
        }

        private touchHandler(evt:egret.TouchEvent):void {
            if (evt.type == egret.TouchEvent.TOUCH_BEGIN) {
                if(model.UserModel.Ins.getIsClosed()){
                    return;//活动结束后长安开始按钮不会进入自动状态.
                }

                if (!this.auto) {
                    var self = this;
                    self._timeoutId = setTimeout(function ():void {
                        console.log('[SlotBtn]', 'long press', `auto: ${self.auto}, timeoutId: ${self._timeoutId}`);
                        self.onAutoRun();
                        //model.UserModel.Ins.isClosed = true;
                    }, SlotBtn.LONG_PRESS_TIME_IN_MS);
                }
            } else if (
                evt.type == egret.TouchEvent.TOUCH_CANCEL || 
                evt.type == egret.TouchEvent.TOUCH_END || 
                evt.type == egret.TouchEvent.TOUCH_RELEASE_OUTSIDE) {
                console.log('[SlotBtn]', evt.type, `auto: ${this.auto}, timeoutId: ${this._timeoutId}`);
                if (!this.auto) {
                    if (this._timeoutId) {
                        clearTimeout(this._timeoutId);
                        this._timeoutId = -1;
                    }
                }
            }
        }

        private displayArrow(bl):void{
            var jiantou = this._slot.m_n9.m_jiantou;
            jiantou.visible = bl;
        }

        private displayTouch():void{
            var dianji = this._slot.m_n9.m_dianji;
            //ui.UIUtils.initStarswfAni("laohujinew004","mc_laohujinew001xxg_dianji",this._slot.m_n9.m_dianji,false,false);
            var guangQuan = game.Animation.get("laohujinew004","mc_laohujinew001xxg_dianji")
                .attach(this._slot.m_n9.m_dianji)
                //.fitScale()
                .onStop(true)
                .play(false);

            console.log('======>>');
        }

    }

}