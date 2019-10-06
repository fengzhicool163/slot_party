module view {

    export class SlotHorseRaceLamp {

        private static _ins:SlotHorseRaceLamp;
        public static get Ins():SlotHorseRaceLamp {
            if (this._ins == null) this._ins = new SlotHorseRaceLamp();
            return this._ins;
        }

        private _slot:ui.slots.UI_slots;

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        private doLogic():void {
            ui.HorseRaceLamp.init(this._slot.m_n156.m_n35);

            game.GameEvent.DISPLAY_HORSERACELAMP.add(this.showHorseLamp, this);
        }

        private showHorseLamp(bl): void {
            //this._slot.getControllerAt(0).selectedIndex = bl ? 1 : 0;
            this._slot.m_n156.visible = bl;
        }

    }

}