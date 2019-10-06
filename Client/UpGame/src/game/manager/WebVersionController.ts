/**
 * Created by liangrui on 6/14/16.
 */

module game {
    export class WebVersionController implements RES.IVersionController {

        private _versionInfo:Object = {};

        public constructor() {
        }

        public fetchVersion(callback:egret.AsyncCallback):void {
            if (DEBUG) {
                callback.onSuccess(null);
                return;
            }

            var self = this;
            var virtualUrl:string = PPGame.MANIFEST_URL;

            var httpLoader:egret.HttpRequest = new egret.HttpRequest();
            httpLoader.addEventListener(egret.Event.COMPLETE, onLoadComplete, this);
            httpLoader.addEventListener(egret.IOErrorEvent.IO_ERROR, onError, this);

            // httpLoader.open(virtualUrl + "?r=" + Date.now(), "get");
            httpLoader.open(virtualUrl, egret.HttpMethod.GET);
            httpLoader.send();

            function onError(event:egret.IOErrorEvent) {
                removeListeners();
                callback.onFail(1,null);
            }

            function onLoadComplete() {
                removeListeners();

                try {
                    self._versionInfo = JSON.parse(httpLoader.response);

                    PPGame.Ins.trackEvent(PPTrackEvent.LOADING, PPLoadingStep.MANIFEST_LOAD);

                    callback.onSuccess(null);
                } catch (e) {
                    self._versionInfo = {};

                    PPGame.Ins.trackEvent(PPTrackEvent.LOADING, PPLoadingStep.MANIFEST_PARSE_FAIL);

                    callback.onFail(1,null);
                }
            }

            function removeListeners():void {
                httpLoader.removeEventListener(egret.Event.COMPLETE, onLoadComplete, self);
                httpLoader.removeEventListener(egret.IOErrorEvent.IO_ERROR, onError, self);
            }
        }

        public getChangeList():Array<{url:string; size:number}> {
            return [];
        }

        public getVirtualUrl(url:string):string {
            if (DEBUG) {
                return url;
            }

            var urlInfo:any = (!!this._versionInfo ? this._versionInfo[url] : null);
            if (urlInfo) {
                var ext:string = url.substring(url.lastIndexOf(".") + 1);

                return PPGame.ENV.RES_URL
                    + 'resource/'
                    + urlInfo["v"].substring(0, 2) + "/"
                    + urlInfo["v"] + "_" + urlInfo["s"] + "." + ext;
            } else {
                return url;
            }
        }
    }
}