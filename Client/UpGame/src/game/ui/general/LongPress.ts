module ui {

    export class LongPress extends egret.EventDispatcher {

        public static BEGIN:string = 'onLongPressBegin';
        public static END:string = 'onLongPressEnd';
        public static ACTION:string = 'onLongPressAction';

        public static TRIGGER:number = 1.5;
        public static INTERVAL:number = 1;

        // 第一次派发事件的触发时间。单位秒
        public trigger:number = LongPress.TRIGGER;
        // 派发onAction事件的时间间隔。单位秒。
        public interval:number = LongPress.INTERVAL;
        // 手指按住后，移动超出此半径范围则手势停止。
        public holdRangeRadius:number = 50;

        private _host:fairygui.GObject;
        private _startPoint:egret.Point;
        private _started:boolean = false;

        public constructor(host:fairygui.GObject) {
            super();

            this._host = host;
            this.trigger = LongPress.TRIGGER;
            this.interval = LongPress.INTERVAL;
            this.holdRangeRadius = 50;
        }

        public enable(value:boolean) {
            if (value) {
                this._host.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                this._host.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            } else {
                this._host.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
                this._host.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);

                egret.stopTick(this.onTime, this);
            }
        }

        private onTouchBegin(e:egret.TouchEvent):void {

        }

        private onTouchEnd(e:egret.TouchEvent):void {

        }

        private onTime(time:number):boolean {
            var p:egret.Point = this._host.globalToLocal(fairygui.GRoot.mouseX, fairygui.GRoot.mouseY);

            return false;
        }

    }

}