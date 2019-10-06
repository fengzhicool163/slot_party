/**
 * Created by zhaikaiyu on 16-12-22.
 */

module game {

    export class RequestData {
        public type:string;
        public url:string;
        public callback:Function;
        public context:any;
        public msg:any;
        public isHideLoading:boolean;
        public isProtobuf:boolean;

        public constructor(type:string, url:string, callback:Function, context:any, msg:any, isHideLoading:boolean, isProtobuf:boolean) {
            this.url = url ;
            this.type = type;
            this.callback = callback;
            this.context = context;
            this.msg = msg;
            this.isHideLoading = (isHideLoading || false);
            this.isProtobuf = (isProtobuf || false);
        }
    }

    export class Request {

        private static queue:RequestData[] = [];
        private static current:RequestData;
        private static loader:EgretRequestWrapper;
        private static lastReq:RequestData;

        public static Get(url:string, callback:Function, context:any, isHideLoading?:boolean):void {
            Request.addQueue(egret.HttpMethod.GET, url, callback, context, null, isHideLoading);
        }

        public static Post(url:string, callback:Function, context:any, message:any, isHideLoading?:boolean, isProtobuf?:boolean):void {
            Request.addQueue(egret.HttpMethod.POST, url, callback, context, message, isHideLoading, isProtobuf);
        }

        public static addQueue(type:string, url:string, callback:Function, context:any, message:any, isHideLoading?:boolean, isProtobuf?:boolean):void {
            var data:RequestData = new RequestData(type, url, callback, context, message, isHideLoading, isProtobuf);
            Request.queue.push(data);
            Request.next();
        }

        public static clearQueue():void {
            Request.queue = [];
            Request.current = null;
        }

        public static retry():void {
            if (!Request.lastReq || !Request.loader || Request.loader.isSending()) return;
            Request.queue.unshift(Request.lastReq);
            Request.next();
        }

        public static next():void {
            if (Request.loader && Request.loader.isSending()) return;
            if (Request.current) return;

            if (!Request.loader) {
                Request.loader = new EgretRequestWrapper(Request.onComplete, Request);
            }
            if (Request.queue && Request.queue.length) {
                Request.current = Request.queue.shift();
            }
            if (Request.current) {
                Request.loader.setData(Request.current);
            }
        }

        private static onComplete(data:any):void {
            var reqData:RequestData = Request.current;
            Request.current = null;
            Request.lastReq = reqData;
            if (!!data && !!reqData && reqData.callback) {
                reqData.callback.apply(reqData.context, [data]);
            }
        }
    }

    export class EgretRequestWrapper {

        private static MAX_RETRY:number = 0;

        private _data:RequestData;
        private _req:egret.HttpRequest;
        private _timeoutId:number = -1;
        private _retry:number = 0;

        private _onComplete:Function;
        private _context:any;

        public constructor(onComplete:Function, context:any) {
            this._onComplete = onComplete;
            this._context = context;
        }

        public setData(data:RequestData):void {
            this._data = data;
            this._retry = 0;
            this.send();
        }

        public getData():RequestData {
            return this._data;
        }

        public isSending():boolean {
            return (this._req != null);
        }

        private send():void {
            if (this.isSending()) return;

            this.lockScreen();
            this.genRequest();

            var data;
            if (this._data.isProtobuf) {
                data = this._data.msg.toArrayBuffer();
            } else if (typeof this._data.msg === "object") {
                data = JSON.stringify(this._data.msg);
            } else {
                data = this._data.msg;
            }

            egret.log(" <-- url :", this._data.url);
            egret.log(" <-- req :", data);
            this._req.send(data);

            this.waitForTimeout();
        }

        private genRequest():void {
            var xhr = new egret.HttpRequest();
            if (this._data.isProtobuf) {
                xhr.responseType = egret.HttpResponseType.ARRAY_BUFFER;
            } else {
                xhr.responseType = egret.HttpResponseType.TEXT;
                xhr.setRequestHeader("Content-Type","text/json;charset=UTF-8"); // 目前固定
            }
            xhr.open(this._data.url, this._data.type);
            xhr.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
            xhr.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);

            this._req = xhr;
        }

        private onComplete(e:egret.Event):void {
            var data = this._req.response;
            egret.log(" --> res :", this._req.response);

            if (!this._data.isProtobuf) {
                try {
                    data = JSON.parse(data);
                } catch (e) {
                    data = {error:model.ErrorCode.JSON_PARSE_ERROR};
                }
            }
            this.releaseTimeout();
            this.releaseRequest();
            this.releaseLockScreen();

            if (this._onComplete) this._onComplete.apply(this._context, [data]);
        }

        private onError(e:egret.IOErrorEvent):void {
            egret.log(" <-- err :", 'IOError');
            this.releaseLockScreen();
            this.retry();
        }

        private waitForTimeout():void {
            var self = this;
            this._timeoutId = setTimeout(function ():void {
                self.retry();
            }, 15000);
        }

        private retry():void {
            this._retry ++;

            this.releaseTimeout();

            if (this._req) {
                this._req.abort();
                this.releaseRequest();
            }

            if (this._retry > EgretRequestWrapper.MAX_RETRY) {
                this._retry = 0;
                // 网络出错重刷
                this.onRefresh();
            } else {
                this.send();
            }
        }

        private onRefresh():void {
            this.releaseLockScreen();
            if (this._onComplete) {
                this._onComplete.apply(this._context, [{error:model.ErrorCode.IO_ERROR}]);
            }
        }

        public releaseTimeout():void {
            if (this._timeoutId != -1) {
                clearTimeout(this._timeoutId);
                this._timeoutId = -1;
            }
        }

        public releaseRequest():void {
            if (this._req) {
                this._req.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
                this._req.removeEventListener(egret.IOErrorEvent.IO_ERROR, this.onError, this);
                this._req = null;
            }
        }

        public lockScreen():void {
            // 锁屏
            if (!this._data.isHideLoading) {
                game.GameEvent.LOCK_SCREEN.dispatch(true);
            }
        }

        public releaseLockScreen():void {
            // 取消锁屏
            if (!this._data.isHideLoading) {
                game.GameEvent.LOCK_SCREEN.dispatch(false);
            }
        }
    }
}