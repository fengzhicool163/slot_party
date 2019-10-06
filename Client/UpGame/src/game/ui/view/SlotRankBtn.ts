/**
 * Created by a123 on 17-1-12.
 */
module view{
    export class SlotRankBtn{
        private static _ins:SlotRankBtn;
        public static get Ins():SlotRankBtn {
            if (this._ins == null) this._ins = new SlotRankBtn();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        public doLogic():void{
            this._slot.m_n41.addClickListener(this.getRanking , this);
        }

        public getRanking():void{
            if (SlotBtn.Ins.running) return;
            
            model.UserModel.Ins.getRanking(1,function (result) {
                ui.UILayer.Ins.popup(ui.PopUpIds.RANKINGPOP, result);
            } , this);
            //ui.UILayer.Ins.popup(ui.PopUpIds.RANKINGPOP, result);
            //WindowMsg.Ins.posMessage({key:"popup",identity:"slotrule"});

        }
    }
}