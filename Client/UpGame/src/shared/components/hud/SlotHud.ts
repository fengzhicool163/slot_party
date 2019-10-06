module components.hud {

    export class SlotHud implements components.core.IUIReplacement {

        private _ui: components.hud.ISlotHud;
        private _replacer: fairygui.GComponent;
        private _logicClass: any;

        private _onCompleteCallback: Function;
        private _onCompleteCallbackContext: any;

        public constructor() {
            components.hud.hudBinder.bindAll();
        }

        public setParams(replacer: fairygui.GComponent, logicClass: any): components.core.IUIReplacement {
            var self = this;
            self._replacer = replacer;
            self._logicClass = logicClass;
            return self;
        }

        public init(): components.core.IUIReplacement {
            var self = this;
            if (!self._replacer) return;

            ui.core.UIReplacementWrapper.do(self._replacer, function (view: fairygui.GObject) {
                self._ui = self.wrap(view);
                self.doLogic();
            }, self);
            return self;
        }

        public onComplete(callback: Function, context?: any): components.core.IUIReplacement {
            this._onCompleteCallback = callback;
            this._onCompleteCallbackContext = context;

            return this;
        }

        private wrap(view: fairygui.GObject): components.hud.ISlotHud {
            var ui: components.hud.UI_hud = view as components.hud.UI_hud;
            var hud: components.hud.ISlotHud = {
                controller: ui.m_c1,
                returnBtn: ui.m_n8, 
                headComp: ui.m_n34.m_n34,
                nameText: ui.m_n4,
                diamondGraph: ui.m_002_shuzi,
                diamondText: function (): egret.TextField {
                    var text:egret.TextField = new egret.TextField();
                    text.size = 24;
                    text.textColor = 0xffffff;
                    text.y = 6;
                    text.width = 120;
                    text.textAlign = egret.HorizontalAlign.LEFT;
                    text.name = "labelTxt";
                    return text;
                }(),
                chargeBtn: ui.m_n5,
                musicBtn: ui.m_n7,
                taskComp: ui.m_n9,
            };
            return hud;
        }

        private doLogic(): void {
            var logic: any = new this._logicClass(this._ui);

            if (!!this._onCompleteCallback)
                this._onCompleteCallback.apply(this._onCompleteCallbackContext, [logic]);
        }

    }

}