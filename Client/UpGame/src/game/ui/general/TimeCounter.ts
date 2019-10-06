/**
 * Created by huangqingfeng on 16/5/16.
 */
module ui {

    export class TimeCounter {

        private _timer:egret.Timer;

        private _initTime:number = 0;
        private _currentTime:number = 0;

        private _interval:number = 0;
        private _repeat:number = 0;
        private _updateCallback:Function;
        private _updateCallbackObj:any;
        private _completeCallback:Function;
        private _completeCallbackObj:any;

        private _plugins:ITimeCounterPlugin[] = [];

        private _cleanAfterComplete:boolean = true;

        public static create(interval:number, repeat?:number, cleanAfterComplete?:boolean):TimeCounter {
            return new TimeCounter(interval, repeat, cleanAfterComplete);
        }

        public constructor(interval:number, repeat?:number, cleanAfterComplete?:boolean) {
            this._cleanAfterComplete = cleanAfterComplete === undefined ? true : cleanAfterComplete;
            this._timer = new egret.Timer(interval, repeat);
        }

        public use(pluginCls:any):TimeCounter {
            if (pluginCls) {
                var plugin:ITimeCounterPlugin = new pluginCls() as ITimeCounterPlugin;
                if (plugin) {
                    if (!this._plugins) this._plugins = [];

                    this._plugins.push(plugin);
                }
            }
            return this;
        }

        public setUpdateCallback(callback:Function, context?:any):TimeCounter {
            this._updateCallback = callback;
            this._updateCallbackObj = context;
            if (this._updateCallback) {
                if (!this._timer.hasEventListener(egret.TimerEvent.TIMER)) {
                    this._timer.addEventListener(egret.TimerEvent.TIMER, this.onUpdate, this);
                }
            }
            return this;
        }

        public setCompleteCallback(callback:Function, context?:any):TimeCounter {
            this._completeCallback = callback;
            this._completeCallbackObj = context;
            if (this._completeCallback) {
                if (!this._timer.hasEventListener(egret.TimerEvent.TIMER_COMPLETE)) {
                    this._timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onComplete, this);
                }
            }
            return this;
        }

        public start():TimeCounter {
            if (this._timer.running) return;
            this._timer.start();
            if (!this._initTime)
                this._initTime = egret.getTimer();
            if (!this._currentTime)
                this._currentTime = egret.getTimer();
            return this;
        }

        public pause():TimeCounter {
            this._timer.stop();
            this._currentTime = egret.getTimer();
            return this;
        }

        public stop():TimeCounter {
            this._timer.stop();
            this._timer.removeEventListener(egret.TimerEvent.TIMER, this.onUpdate, this);
            this._timer.removeEventListener(egret.TimerEvent.TIMER_COMPLETE, this.onComplete, this);
            this._initTime = this._currentTime = 0;
            this._interval = this._repeat = 0;
            return this;
        }

        private onUpdate(e:egret.TimerEvent):void {
            var t:number = egret.getTimer(),
                delta:number = t - this._currentTime;
            this._currentTime = t;
            if (this._plugins.length) {
                for (var i:number = 0; i < this._plugins.length; i ++) {
                    this._plugins[i].onUpdate(delta);
                }
            }
            if (this._updateCallback)
                this._updateCallback.apply(this._updateCallbackObj, [delta]);
        }

        private onComplete(e:egret.TimerEvent):void {
            if (this._plugins.length) {
                for (var i:number = 0; i < this._plugins.length; i ++) {
                    this._plugins[i].onComplete();
                }
            }

            if (this._completeCallback) {
                this._completeCallback.apply(this._completeCallbackObj);
            }
            if (this._cleanAfterComplete) {
                this.stop();

                this._updateCallback = null;
                this._updateCallbackObj = null;
                this._completeCallback = null;
                this._completeCallbackObj = null;
            }
        }

    }

    export interface ITimeCounterPlugin {

        onUpdate(timePassed:number):void;
        onComplete():void;

    }

    export class TimeCounterPluginEnergy implements ITimeCounterPlugin {

        public onUpdate(timePassed:number):void {

        }

        public onComplete():void {

        }

    }

}