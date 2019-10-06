/**
 * Created by huangqingfeng on 16/5/11.
 */
module model {

    export class GeneralServerRequest {
        /*
        * 服务器时间
        * */
        private static serverTime:number = 0;
        /*
        * 上一次更新服务器时间的时间
        * */
        private static lasetServerTimeUpdateTime:number = 0;
        /*
        * 通过admin修改过的服务器时间
        * */
        private static hackedServerTime:number = 0;

        /*
        * 获取当前服务器时间
        * */
        public static getServerTime():number {
            // 如果修改过服务器时间,返回修改过的时间
            if (GeneralServerRequest.hackedServerTime) {
                return GeneralServerRequest.hackedServerTime + egret.getTimer();
            }
            return GeneralServerRequest.serverTime + egret.getTimer() - GeneralServerRequest.lasetServerTimeUpdateTime;
        }

        /*
        * 处理接口请求,通用的逻辑可以走这个,不通用的单写去吧.
        * */
        public static req(router:string, data:any, resultMethod:RequestResultMethod, url?:string, isHideLoading:boolean = false, isProtobuf:boolean = false):void {
            if (!isProtobuf) {
                if (!data) data = {};
                if (!data.id) data.id = model.UserModel.Ins.userId;
            }
            if (!url) {
                url = PPGame.ENV.BASE_URL + router;
            } else {
                url = url + router;
            }

            var resultHandler = new RequestResultHandler(resultMethod, isProtobuf);
            game.Request.Post(url, function (result:any):void {
                // 处理protobuf的回调
                if (isProtobuf) {
                    var protoPhaser = model.UpSDKModel.Ins.getProtoParser();
                    var dataWrap = protoPhaser.Result.decode(result);

                    console.log('proto result:', dataWrap);
                    if (dataWrap.code != 1) {
                        resultHandler.onFail(dataWrap, dataWrap.code);
                    } else {
                        resultHandler.onSuccess(dataWrap.data.value);
                    }
                // 处理游戏逻辑的回调
                } else {
                    // 出错处理
                    if (result.error) {
                        resultHandler.onFail(result, result.error);
                    } else {
                        // 修改过的服务器时间
                        if (result.hackServerTime)
                            GeneralServerRequest.hackedServerTime = result.hackServerTime;

                        // 同步服务器时间
                        if (result.serverTime) {
                            GeneralServerRequest.serverTime = result.serverTime;
                            GeneralServerRequest.lasetServerTimeUpdateTime = egret.getTimer();
                            // 通知
                            game.GameEvent.SERVER_TIME_UPDATE.dispatch(GeneralServerRequest.getServerTime());
                        }

                        resultHandler.onSuccess(result);
                    }
                }
            }, this, data, isHideLoading, isProtobuf);
        }

        public static reqReportClientError(errLog:string[]) {
            // var params:any = {
            //     errors: errLog,
            //     serverId: this._currentServer && this._currentServer.id
            // };
            // var userInfo = model && model.UserModel && model.UserModel.Ins && model.UserModel.Ins.getUserInfo();
            // if (userInfo && userInfo.nickName) {
            //     params.nickName = userInfo.nickName || '';
            //
            //     var hideLoading = true;
            //     GeneralServerRequest.req('reportClientError', params, function (result:any):void {
            //     }, this, this.getServerListURL(), hideLoading);
            // }
        }
    }

    export interface RequestResultMethod {
        context: any;
        onSuccess: (result:any) => void;
        onFail: (result:any, errorCode:number) => void;
    }

    export class RequestResultHandler {

        private method:RequestResultMethod;
        private isProtobuf:boolean = false;

        public constructor(method:RequestResultMethod, isProtobuf:boolean) {
            this.method = method;
            this.isProtobuf = isProtobuf;
        }

        public onSuccess(result:any):void {
            this.method.onSuccess.apply(this.method.context, [result]);
            // 发送队列中的下一个请求
            game.Request.next();
        }

        public onFail(result:any, errorCode:number):void {
            var self = this;
            var notifyCb = function(hasAction:boolean):void {
                self.method.onFail.apply(self.method.context, [result, errorCode]);
            };
            if (this.isProtobuf) {
                ErrorAction.notifyProtoError(result.code, result.msg, notifyCb);
            } else {
                ErrorAction.notifyError(result.error, notifyCb);
            }
        }
    }

    export class ErrorCode {
        public static INTERNAL_SERVER_ERROR:number = 1;
        public static INVALID_REQUEST_PARAMS:number = 2;
        public static ACTIVITY_NOT_OPEN:number = 3; //活动尚未开启
        public static ACTIVITY_END:number = 4; //活动结束
        public static IO_ERROR:number = 7;
        public static JSON_PARSE_ERROR:number = 8;
    }

    interface ErrorActionHandler {
        msg:String,
        onConfirm:Function,
        onCancel:Function
    }

    export class ErrorAction {

        private static ActionMap:any;

        public static initActionMap():any {
            var map:any = {};
            map[ErrorCode.INTERNAL_SERVER_ERROR] = {
                msg: game.Tools.lang('內部伺服器錯誤'),
                onConfirm: null,
                onCancel: null
            };
            map[ErrorCode.INVALID_REQUEST_PARAMS] = {
                msg: game.Tools.lang('非法參數'),
                onConfirm: null,
                onCancel: null
            };
            map[ErrorCode.IO_ERROR] = {
                msg: game.Tools.lang('網路異常，請點擊確定按鈕重試'),
                onConfirm: ErrorAction.retry,
                onCancel: ErrorAction.clearQueue
            };
            map[ErrorCode.ACTIVITY_END] = {
                msg: game.Tools.lang('活動已結束!'),
                onConfirm: ErrorAction.activityEnd,
                onCancel: null
            };
            ErrorAction.ActionMap = map;
        }

        public static reload():void {
            PPGame.Ins.reload();
        }

        public static retry():void {
            game.Request.retry();
        }

        public static clearQueue():void {
            game.Request.clearQueue();
        }
        public static activityEnd():void {

        }

        public static notifyError(code:number, cb:(hasAction:boolean) => void):void {
            var self = this;
            var actionHandler:ErrorActionHandler = ErrorAction.ActionMap[code];
            if (actionHandler) {
                var confirmCallback = function ():void {
                    if (actionHandler.onConfirm) {
                        actionHandler.onConfirm();
                    }
                    return cb(true);
                };
                var cancelCallback = function ():void {
                    if (actionHandler.onCancel) {
                        actionHandler.onCancel();
                    }
                    return cb(true);
                };
                ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION, {
                    content: actionHandler.msg,
                    confirmCallback: confirmCallback,
                    confirmCallbackObj: self,
                    cancelCallback: cancelCallback,
                    cancelCallbackObj: self
                });
            } else {
                return cb(false);
            }
        }

        public static notifyProtoError(code:number, msg:string, cb:(hasAction:boolean) => void):void {
            var self = this;
            var closeCallback = function ():void {
                return cb(true);
            };
            ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION, {
                content: code + ':' + msg,
                confirmCallback: closeCallback,
                confirmCallbackObj: self,
                cancelCallback: closeCallback,
                cancelCallbackObj: self
            });
        }
    }
}