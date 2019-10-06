module ui {

    export class SlotNumberScroller extends egret.Sprite {

        private _tf:egret.BitmapText;
        private _supportLocale:boolean = false;

        private _scalable:boolean = true;
        private _stopCallback:Function;
        private _stopCallbackObj:any;

        private _stayTime:number = 0;
        private _stayFrame:number = 0;
        private _stayFramePassed:number = 0;

        private _updateTime:number;
        private _updateFrame:number;
        private _updateFramePassed:number = 0;

        private _slicePart:number = 0;

        private _target:number = 0;

        public constructor(font:string, updateTime:number = 0.6, stayTime:number = 1) {
            super();

            this._updateTime = updateTime;
            this._stayTime = stayTime;

            this._tf = new egret.BitmapText();
            this._tf.letterSpacing = -40;
            this._tf.font = RES.getRes(font);
            this._tf.text = '0';
            this.addChild(this._tf);

            var n = 0;
            this._supportLocale = !!n.toLocaleString && n.toLocaleString('zh-CN') != n + '';

            ui.UIUtils.lifeTime(this, this.onAdded, this.onRemoved);
        }

        private onAdded():void {
            this._updateFrame = Math.round(this._updateTime * this.stage.frameRate);
            this._stayFrame = Math.round(this._stayTime * this.stage.frameRate);
            console.log('[SlotNumberScroller]', 'this._updateFrame:', this._updateFrame);

            this.current = 0;

            if (this._target > 0 && !this.hasEventListener(egret.Event.ENTER_FRAME)) 
                this.addEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);
        }

        public getWith():number {
            return this._tf.width;
        }

        private onRemoved():void {
            this.stop();
        }

        public stop():void {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);
            this._updateFramePassed = 0;
            this._stayFramePassed = 0;
            this._target = 0;
            this._slicePart = 0;
        }

        set target(value:number) {
            this._target = value;

            if (!this.hasEventListener(egret.Event.ENTER_FRAME)) 
                this.addEventListener(egret.Event.ENTER_FRAME, this.onUpdate, this);
        }

        set current(value:number) {
            if (value <= 0) this.showStr('0');
            else {
                if (this._supportLocale) {
                    this.showStr(value.toLocaleString('zh-CN'));
                } else {
                    this.setNum(value);
                }
            }
        }

        set scalable(value:boolean) {
            this._scalable = value;
        }

        public onStop(callback:Function, context:any):void {
            this._stopCallback = callback;
            this._stopCallbackObj = context;
        }

        private setNum(n:number):void {
            var s:string = '' + n;
            if (('' + n).length > 3) {
                var arr:string[] = s.split('');

                for (var i:number = 3; i < arr.length; i += 4) {
                    arr.splice(arr.length - i, 0, ',');
                }

                this.showStr(arr.join(''));
            } else {
                this.showStr(s);
            }
        }

        private showStr(s:string):void {
            if (s.replace('0', '') == '') this._tf.visible = false;
            else {
                this._tf.visible = true;
                this._tf.text = s;
                this._tf.x = -this._tf.width / 2;
            }
        }

        private onUpdate():void {
            if (this._updateFramePassed == this._updateFrame) {
                this.current = this._target;
                this.scaleX = this.scaleY = 1;

                if (this._stayFramePassed == this._stayFrame) {
                    this.stop();
                    if (!!this._stopCallback) this._stopCallback.apply(this._stopCallbackObj);
                }

                this._stayFramePassed ++;
            } else {
                if (this._updateFramePassed == 0) {
                    this.current = 0;
                    this.scaleX = this.scaleY = 1;
                } else {
                    this.current = Math.round(this._target * this._updateFramePassed / this._updateFrame);

                    if (this._scalable) {
                        if (this._slicePart == 0) {
                            this._slicePart = this._updateFrame / 2;
                        }

                        var a:number = this._updateFramePassed > this._slicePart ? 0.4 : 0.2;

                        var p:number = (this._updateFramePassed % this._slicePart) / this._slicePart;
                        this.scaleX = this.scaleY = 1 + (Math.sin(Math.PI * p) * a);
                    }
                }
                this._updateFramePassed ++;
            }
        }

    }

}