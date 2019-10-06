module init {

    export class BaseInit {

        public static get sequence():SequenceInit {
            return new SequenceInit();
        }

        private _cb:Function;
        private _ctx:any;

        private _supportedPlatforms:string[];

        public constructor(supportedPlatforms:string[] = null) {
            this._supportedPlatforms = supportedPlatforms;
        }

        public handle(cb:Function, ctx:any):void {
            this._cb = cb;
            this._ctx = ctx;

            var supported:boolean = true;
            if (supported) {
                // console.log('[Init]', inst.name, '初始化 -- 开始!');
                this.handler_do();
            } else {
                // console.log('[Init]', inst.name, '初始化 -- 跳过!');
                this.handler_ingore();
            }
        }

        protected isSupported(platform:string):boolean {
            if (!this._supportedPlatforms) return true;

            return this._supportedPlatforms.indexOf(platform) != -1;
        }

        protected handler_do():void {
            var isNative:boolean = false;
            if (isNative) this.handler_native();
            else this.handler_web();
            this.done();
        }

        protected handler_web():void {

        }

        protected handler_native():void {

        }

        protected handler_ingore():void {
            this.done();
        }

        protected done():void {
            var inst:any = this.constructor;
                // console.log('[Init]', inst.name, '初始化 -- 完成!');
            if (!!this._cb) this._cb.apply(this._ctx ? this._ctx : this, [this]);
        }

        public dispose():void {
            this._supportedPlatforms = null;
            this._cb = null;
            this._ctx = null;
        }

    }

    export class SequenceInit {

        private _queue:BaseInit[] = [];

        private _onComplete:Function;
        private _onCompleteCtx:any;
        private _current:BaseInit;

        public add(inst:BaseInit):SequenceInit {
            this._queue.push(inst);

            return this;
        }

        public remove(inst:BaseInit):SequenceInit {
            var idx:number = this._queue.indexOf(inst);
            if (idx != -1) {
                this._queue.splice(idx, 1);
            }
            
            return this;
        }

        public done(onComplete?:Function, onCompleteCtx?:any):SequenceInit {
            this._onComplete = onComplete;
            this._onCompleteCtx = onCompleteCtx;

            return this;
        }

        public do():void {
            console.log('[Init]', '初始化队列 -- 开始!');
            this.doNext();
        }

        public dispose():void {
            if (!this._queue || this._queue.length == 0) return;
            for (var i:number = 0; i < this._queue.length; i ++) {
                this._queue[i].dispose();
            }
            this._queue = [];
        }

        private doNext(inst?:BaseInit):void {
            var next:BaseInit = this.getNext(inst);
            if (!!next) {
                this._current = next;
                next.handle(this.doNext, this);
            } else {
                // done
                console.log('[Init]', '初始化队列 -- 完成!');
                this._current = null;
                if (!!this._onComplete) this._onComplete.apply(this._onCompleteCtx);
            }
        }

        private getNext(inst?:BaseInit):BaseInit {
            if (this._queue && this._queue.length > 0) {
                if (!inst) inst = this._current;
                if (!inst) {
                    return this._queue[0];
                }
                var idx:number = inst ? 
                    this._queue.indexOf(inst) : -1;
                if (idx >= 0 && this._queue.length > (idx + 1)) {
                    return this._queue[idx + 1];
                }
            }
            return null;
        }

    }

}