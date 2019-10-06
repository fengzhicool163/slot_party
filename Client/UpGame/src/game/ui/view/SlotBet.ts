/**
 * Created by a123 on 17-1-12.
 */
module view{
    export class SlotBet{
        private static _ins:SlotBet;
        private _slot:ui.slots.UI_slots;
        private betArr:any = [model.LocalConfigModel.Ins.slotsgamecontent('bet1'),model.LocalConfigModel.Ins.slotsgamecontent('bet2')
            ,model.LocalConfigModel.Ins.slotsgamecontent('bet3')];
        private  btnArr:any;
        private betMuilti:any = [model.LocalConfigModel.Ins.slotsgamecontent('bet1multi'),model.LocalConfigModel.Ins.slotsgamecontent('bet2multi')
            ,model.LocalConfigModel.Ins.slotsgamecontent('bet3multi')];
        private _selectedIndex:number = 0;

        public static get Ins():SlotBet {
            if (this._ins == null) this._ins = new SlotBet();
            return this._ins;
        }

        public init(slot:ui.slots.UI_slots):void{
            this._slot = slot;
            this.doLogic();
        }

        public doLogic():void{
            this.btnArr = [this._slot.m_n80 , this._slot.m_n81 , this._slot.m_n82];

            this._selectedIndex = 1;
            this.updateByIndex(this._selectedIndex);

            for(var i = 0; i<3 ; i++){
                var btn = this.btnArr[i];
                btn['tag'] = i;
                btn.addClickListener(this.betClick , this);
            }
           // game.UIEvent.BET.dispatch(this.betArr[0]);

            game.UIEvent.SLOT_FREE_TIMES.add(this.onFreeTimes, this);
            this.onFreeTimes();
        }

        private onFreeTimes():void {
            if (model.UserModel.Ins.freeTimes > 0) {
                // 强制更新到最大
                this.updateByIndex(this.betArr.length - 1);
            }
        }

        public betClick(e:egret.Event):void{
            if (SlotBtn.Ins.running || model.UserModel.Ins.freeTimes > 0) {
                this.updateByIndex(this._selectedIndex);
            } else {
                var target = e.currentTarget;
                var index = target['tag'];
                this.updateByIndex(index);
            }
        }

        private updateByIndex(selectedIndex:number):void {
            this._selectedIndex = selectedIndex;

            console.log('[SlotBet]', `选中${this._selectedIndex}`);

            for(var i = 0 ; i < this.btnArr.length ; i++) {
                this.btnArr[i].selected = this._selectedIndex == i;
            }
            game.UIEvent.BET.dispatch(this.betArr[this._selectedIndex],this.betMuilti[this._selectedIndex]);
        }


    }
}