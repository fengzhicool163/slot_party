/**
 * Created by a123 on 17-1-12.
 */
module view{
    export class SlotLine{
        private static  _ins:SlotLine;
        private _slot:ui.slots.UI_slots;
        private lineArr:any[] = [model.LocalConfigModel.Ins.slotsgamecontent('line1'),
            model.LocalConfigModel.Ins.slotsgamecontent('line2'),model.LocalConfigModel.Ins.slotsgamecontent('line3')];
        private btnArr:fairygui.GButton[];

        private _selectedIndex:number = 0;

        public static get Ins():SlotLine{
            if (this._ins == null) this._ins = new SlotLine();
            return this._ins;
        }

        public init(slot:ui.slots.UI_slots):void{
            this._slot = slot;

            this.doLogic();
        }

        public doLogic():void {
            this._selectedIndex = 2;
            this.btnArr = [this._slot.m_n121 , this._slot.m_n123 , this._slot.m_n125];

            this.updateByIndex(this._selectedIndex);

            for(var i = 0 ; i < 3; i++){
                var btn = this.btnArr[i];
                btn['tag'] = i;
                btn.addClickListener(this.btnLine , this);
            }

            game.UIEvent.SLOT_FREE_TIMES.add(this.onFreeTimes, this);
            this.onFreeTimes();
        }

        private onFreeTimes():void {
            if (model.UserModel.Ins.freeTimes > 0) {
                // 强制更新到最大
                this.updateByIndex(this.lineArr.length - 1);
            }
        }

        public btnLine(e:egret.Event):void {
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

            console.log('[SlotLine]', `选中${this._selectedIndex}`);

            for(var i = 0 ; i < this.btnArr.length ; i++) {
                this.btnArr[i].selected = this._selectedIndex == i;
            }
            game.UIEvent.LINE.dispatch(this.lineArr[this._selectedIndex]);
        }

    }
}