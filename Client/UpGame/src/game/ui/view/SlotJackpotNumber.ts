module ui {

    export class SlotJackpotNumber {

        private _number:fairygui.GTextField;
        private _timer:number = 0;
        private _timeout:egret.Timer = null;
        private _updateTime:number = 0;
        private _currentValue:number = 0;
        private _scrollerTime:number = 10;//数字滚动时间
        private _frameRate:number = 0;
        private _frameValue:number = 0;

        private _oldScrollerTime:number = 10;//数字滚动时间
        private _oldFrameRate:number = 0;

        private _downTime:number = 1;
        private _upTime:number = 1;

        private _stopCallback:Function;
        private _stopCallbackObj:any;

        private _target:number = 0;

        public constructor(object:fairygui.GTextField, updateTime:number = 0.016) {

            this._updateTime = updateTime;

            this._frameRate = Math.ceil(this._scrollerTime/this._updateTime);

            this._number = object;
            this._number.text = '0';
            //ui.UIUtils.lifeTime(this, this.onAdded, this.onRemoved);
        }

        private onAdded():void {
            //var self = this;
            //this._timeout = setTimeout(function() {
            //
            //}, this._updateTime);

            //this._timeout = egret.getTimer();
            //this._timeout = new egret.Timer(this._updateTime);
            //this._timeout.addEventListener(egret.TimerEvent.TIMER, this.timeoutFunc, this)
            //this._timeout.addEventListener(egret.TimerEvent.TIMER_COMPLETE,this.timerComFunc,this);
            //this._timeout.start();

        }

        public getScrollerTime():number{
            return this._scrollerTime;
        }

        private timeoutFunc():void {
            //clearTimeout(this._timeout);
            //this._timeout = 0;

            this._currentValue += this._frameValue;
            if(this._frameValue < 0){

                if(this._currentValue < this._target){
                    this._currentValue = this._target;
                    this.stopScroll();
                    //this.stopTimer();
                    //this.timerComFunc(this._scrollerTime);
                }

            }else {

                if(this._currentValue > this._target){
                    this._currentValue = this._target;
                    this.stopScroll();
                    //this.stopTimer();
                    //this.timerComFunc(this._scrollerTime);
                }

            }

            this.setNum(this._currentValue);

        }

        private timerComFunc(time:number):void {
            if (!!this._stopCallback) this._stopCallback.apply(this._stopCallbackObj, [time]);
        }

        private onRemoved():void {
            this.stop(false);
        }

        private start():void {
            if(!this._timeout){
                this._timeout = new egret.Timer(this._updateTime*1000);
                this._timeout.addEventListener(egret.TimerEvent.TIMER, this.timeoutFunc, this);
                this._timeout.start();
                this.timeoutFunc();

                this.startTimer();
            }
        }

        private startTimer():void {
            var self = this;
            this._timer = setTimeout(function() {
                self.stopScroll();
                self.stopTimer(true);
            }, (this._scrollerTime+1)*1000);
        }


        private stopTimer(iscallback:boolean = true):void {
            if(this._timer){
                clearTimeout(this._timer);
                this._timer = 0;
                this._currentValue = this._target;
                this.setNum(this._target);
                //if(this.stop())
                if(iscallback){
                    this.timerComFunc(this._scrollerTime);
                }

            }
        }

        public stop(iscallback:boolean = true):void  {
            this.stopScroll();
            this.stopTimer(iscallback);
        }

        public stop2():void  {
            if(this._timeout){
                this._timeout.stop();
                this._timeout.removeEventListener(egret.TimerEvent.TIMER,this.timeoutFunc,this);
                this._timeout = null;
            }

            if(this._timer){
                clearTimeout(this._timer);
                this._timer = 0;
            }
        }

        private stopScroll():boolean {
            if(this._timeout){
                this._currentValue = this._target;
                this.setNum(this._target);
                this._timeout.stop();
                this._timeout.removeEventListener(egret.TimerEvent.TIMER,this.timeoutFunc,this);
                this._timeout = null;
                return true;
            }
            return false;
        }

        set target(value:number) {
            if(this._target == value){
                this.timerComFunc(0);
                return;
            }
            this._target = value;
            var cha = value - this._currentValue;

            this._frameValue =  Math.ceil(cha/this._frameRate) + 1;
            //this._frameValue = this._frameValue > 1?this._frameValue+1:1;
            this.start();
        }

        get target() {
            return this._target;
        }

        get current() {
            return this._currentValue;
        }

        set current(value:number) {
            this._currentValue = value;
        }

        public onStop(callback:Function, context:any):void {
            this._stopCallback = callback;
            this._stopCallbackObj = context;
        }

        private setNum(n:number):void {
            var s:string = '' + n;
            this._number.text = s;
        }





//V型滚动
        public startVScroll():void {
            this.stop2();//停下滚动,不回调
            this.startVDScroll(model.UserModel.Ins.oldJackPotDiamond);
        }
//down
        public startVDScroll(value:number):void {
            this._oldScrollerTime = this._scrollerTime;
            this._oldFrameRate = this._frameRate;

            this._scrollerTime = this._downTime;
            this._frameRate = Math.ceil(this._scrollerTime/this._updateTime);

            this._target = value;
            var cha = value - this._currentValue;
            this._frameValue =  Math.ceil(cha/this._frameRate) + 1;


            this._timeout = new egret.Timer(this._updateTime*1000);
            this._timeout.addEventListener(egret.TimerEvent.TIMER, this.VFunc, this);
            this._timeout.start();
            this.VFunc();

            var self = this;
            var timer = setTimeout(function() {
                self.stopVScroll();
                self._currentValue = self._target;
                self.setNum(self._target);
                self.stopVDTimer(false);

            }, (this._scrollerTime + 0.5)*1000);

        }

        private VFunc():void {

            this._currentValue += this._frameValue;

            if(this._frameValue < 0){

                if(this._currentValue < this._target){
                    this._currentValue = this._target;

                    if(this._timeout) {
                        this._currentValue = this._target;
                        this._timeout.stop();
                        this._timeout.removeEventListener(egret.TimerEvent.TIMER, this.VFunc, this);
                        this._timeout = null;
                    }

                }

            }else {

                if(this._currentValue > this._target){
                    this._currentValue = this._target;

                    if(this._timeout) {
                        this._currentValue = this._target;
                        this._timeout.stop();
                        this._timeout.removeEventListener(egret.TimerEvent.TIMER, this.VFunc, this);
                        this._timeout = null;
                    }

                }

            }

            this.setNum(this._currentValue);

        }


        private stopVDTimer(iscallback:boolean = true):void {

            this.setNum(this._target);
            this._currentValue = this._target;

            var self = this;
            var tt = setTimeout(function() {

                self.startVUScroll(model.UserModel.Ins.jackPotDiamond);

            }, 2*1000);

        }

//up


        public startVUScroll(value:number):void {
            this._scrollerTime = this._upTime;
            this._frameRate = Math.ceil(this._scrollerTime/this._updateTime);

            this._target = value;
            var cha = value - this._currentValue;
            this._frameValue =  Math.ceil(cha/this._frameRate) + 1;



            if(!this._timeout){
                this._timeout = new egret.Timer(this._updateTime*1000);
                this._timeout.addEventListener(egret.TimerEvent.TIMER, this.VFunc, this);
                this._timeout.start();
                this.VFunc();

                var self = this;
                var timer = setTimeout(function() {
                    //self.stopVUTimer(false);
                    self.stopVScroll();

                    var timer2 = setTimeout(function() {
                        game.UIEvent.SHOW_SUPPLEMENT_ANI_END.dispatch();
                        //数据恢复
                        self._scrollerTime = self._oldScrollerTime;
                        self._frameRate = self._oldFrameRate;
                        self.setNum(self._target);
                        self.timerComFunc(self._scrollerTime);
                    },1000);


                }, (this._scrollerTime + 0.5)*1000);

            }

        }

        private stopVScroll():boolean {
            if(this._timeout){
                this._currentValue = this._target;
                this.setNum(this._target);
                this._timeout.stop();
                this._timeout.removeEventListener(egret.TimerEvent.TIMER,this.VFunc,this);
                this._timeout = null;
                return true;
            }
            return false;
        }

        //private stopVUTimer(iscallback:boolean = true):void {
        //    if(this._timer){
        //        clearTimeout(this._timer);
        //        this._timer = 0;
        //        game.UIEvent.SHOW_SUPPLEMENT_ANI_END.dispatch();
        //        //数据恢复
        //        this._scrollerTime = this._oldScrollerTime;
        //        this._frameRate = this._oldFrameRate;
        //        this.setNum(this._target);
        //        this.timerComFunc(this._scrollerTime);
        //
        //
        //    }
        //
        //}




    }

}