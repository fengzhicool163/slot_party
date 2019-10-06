module init {

    export class CatchError extends BaseInit {

        private _catchErrorHistory:any[];
        private _catchErrorTotal:number = 0;
        private _reportCatchErrorSending:boolean = false;

        public constructor() {
            super();
        }

        protected handler_do() {
            // 本地调试不打开error监测
            if (window && window.location && window.location.href && window.location.href.indexOf('localhost') != -1) {
                this.done();
            } else {
                var self = this;

                window.onerror = function (errorMsg, url, lineNumber, column, errorObj:any) {
                    if (errorMsg) {
                        if (errorMsg.indexOf('Script error') > -1) return;
                        if (errorMsg.indexOf("Cannot read property 'asCom' of null") > -1) return;
                        if (errorMsg.indexOf("Cannot read property 'removeEventListener' of null") > -1) return;
                        if (errorMsg.indexOf("Cannot read property 'getItem' of null") > -1) return;
                    }

                    if (self._catchErrorTotal > 50) return;
                    self._catchErrorTotal++;

                    var errMsg = {
                        Error: errorMsg,
                        Script: url,
                        Line: lineNumber,
                        Column: column,
                        ErrorObj: errorObj + '',
                        StackTrace: (errorObj && errorObj.stack && (errorObj.stack + '').split('\n'))
                    };

                    self._catchErrorHistory.push(errMsg);

                    self._reportCatchError();
                };

                this.done();
            }
        }

        private _reportCatchError() {
            var self = this;
            if (!self._reportCatchErrorSending && self._catchErrorHistory.length > 0) {
                self._reportCatchErrorSending = true;

                model.GeneralServerRequest.reqReportClientError(self._catchErrorHistory);
                self._catchErrorHistory = [];

                setTimeout(function() {
                    self._reportCatchErrorSending = false;
                    self._reportCatchError();
                }, 1000);
            }
        }
    }
}