/**
 * Created by huangqingfeng on 16/4/27.
 */
module ui {

    export class Toaster {

        public static BLUE:number = 0x85ECFF;
        private static BLUE_STROKE:number = 0x0D3679;
        public static YELLOW:number = 0xFDDA61;
        private static YELLOW_STROKE:number = 0x561312;

        protected static TOASTERS_POOL:Toaster[] = [];
        protected static TOASTERS_SHOWING:Toaster[] = [];

        private static current:Toaster;
        public static _color:string;

        public static create(content:string, color:number = Toaster.BLUE):Toaster {
            if (Toaster.current) Toaster.current.hide();

            var t:Toaster = this.get();
            t.content = content;
            t.color = color;
            t.strokeColor = color === Toaster.BLUE ? Toaster.BLUE_STROKE : Toaster.YELLOW_STROKE;
            Toaster.current = t;

            fairygui.GRoot.inst.addChild(t.text);
            return t;
        }

        private static get():Toaster {
            var t:Toaster = null;
            if (this.TOASTERS_POOL.length > 0) {
                t = this.TOASTERS_POOL.shift();
            } else {
                t = new ui.Toaster();
            }

            this.TOASTERS_SHOWING.push(t);
            return t;
        }

        private _content:string = "";
        private _text:fairygui.GTextField;

        public constructor() {
            this._text = new fairygui.GTextField();
            this._text.fontSize = 44;
            this._text.align = fairygui.AlignType.Center;
            this._text.width = ui.UILayer.ACTUAL_WIDTH;
            this._text.autoSize = fairygui.AutoSizeType.Height;
        }

        public get text():fairygui.GTextField {
            return this._text;
        }

        public set content(value:string) {
            this._content = value;
            this._text.text = this._content;
            this._text.y = (fairygui.GRoot.inst.height) / 2;

            egret.Tween.get(this._text)
                .wait(800)
                .to({"alpha": 0, "y": this._text.y - 400}, 800)
                .call(this.onHide, this);
        }

        public set color(color:number){
            this._text.color = color;
        }

        public set strokeColor(color:number) {
            this._text.stroke = 2;
            this._text.strokeColor = color;
        }

        public get content():string {
            return this._content;
        }

        public hide():void {
            egret.Tween.removeTweens(this._text);
            this.onHide();
        }

        private onHide():void {
            this._text.removeFromParent();
            // fairygui.GRoot.inst.removeChild(this._text);
            this._content = "";
            this._text.text = "";
            this._text.alpha = 1;
            ui.Toaster.TOASTERS_SHOWING.splice(ui.Toaster.TOASTERS_SHOWING.indexOf(this), 1);
            ui.Toaster.TOASTERS_POOL.push(this);
        }

    }

}