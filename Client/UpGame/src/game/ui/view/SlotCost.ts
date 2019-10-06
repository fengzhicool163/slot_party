module view {

    export class SlotCost {

        private static _ins:SlotCost;
        public static get Ins():SlotCost {
            if (this._ins == null) this._ins = new SlotCost();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;
        
        private _bet:number = 10;
        private _line:number = 1;

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {
            this._slot.m_n135.ubbEnabled = true;

            game.UIEvent.BET.add(this.onBet, this);
            game.UIEvent.LINE.add(this.onLine, this);
            game.UIEvent.SLOT_FREE_TIMES.add(this.onFreeTime , this);
            game.UIEvent.SLOT_RESULT.add(this.onSlotResult, this);
            game.UIEvent.SLOT_COST.add(this.updateCost, this);
        }

        private onBet(bet:any):void {
            this._bet = parseInt(bet);

            this.updateCost();
        }

        private onLine(line:any):void {
            this._line = parseInt(line);

            this.updateCost();
        }

        private onFreeTime():void {
            this.updateCost();
        }

        private onSlotResult():void {
            this.updateCost();
        }

        private updateCost():void {
            if (model.UserModel.Ins.freeTimes > 0) 
                this._slot.m_n135.text = game.Tools.lang('剩餘免費次數 [color=#ffba00]%c[/color] 次!', model.UserModel.Ins.freeTimes);
            else 
                this._slot.m_n135.text = game.Tools.lang('每次消耗 [color=#ffba00]%c[/color] 鑽!', this._bet * this._line);
        }

    }
}