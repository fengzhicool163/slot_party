/**
 * Created by a123 on 17-1-16.
 */
module view{
    export class SlotRule{
        private static _ins:SlotRule;
        private _slot:ui.slots.UI_slots;

        public static get Ins():SlotRule {
            if (this._ins == null) this._ins = new SlotRule();
            return this._ins;
        }

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        public doLogic():void{
            this._slot.m_n104.addClickListener(this.slotRule , this);
        }

        public slotRule():void{
            if (SlotBtn.Ins.running) return;
            
            ui.UILayer.Ins.popup(ui.PopUpIds.SLOT);

        }


    }
}