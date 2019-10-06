module view {

    export class SlotFanli {

        private static _ins:SlotFanli;
        public static get Ins():SlotFanli {
            if (this._ins == null) this._ins = new SlotFanli();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;


        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {
            // var n142 = this._slot.m_n142;
            //n142.addClickListener(this.onClick, this);
            // n142.visible = false;
        }

        private onSuccessComplete(result:any):void {

        }

        private onFailComplete(result:any):void {

        }

        private onClick():void {
            if (SlotBtn.Ins.running) return;

            model.UserModel.Ins.getFreshUpCostDiamond(function (result) {
                ui.UILayer.Ins.popup(ui.PopUpIds.FANLI, result);
            } , this);


            return;
            if(model.UserModel.Ins.getPoint002() >= model.LocalConfigModel.Ins.getPoint002()){
                model.UserModel.Ins.getAwardByType(2,this.onSuccessComplete , this.onFailComplete , this);
            }else {
                ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION,{
                    'selectIndex':1
                })
            }
        }


    }

}