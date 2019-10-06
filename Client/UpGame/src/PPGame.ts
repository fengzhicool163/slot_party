/**
 * Created by liangrui on 22/12/2016.
 */

interface PPGameEnv {
    RES_URL:string,
    BASE_URL:string,
    LOBBY_URL:string,
    UPLIVE_PROTO_URL:string
}

class PPEdition {
    public static ASIA:string = 'asia';
    public static MIDDLE_EAST:string = 'me';
}

class PPGame {
    private static _ins: PPGame;

    public static get Ins(): PPGame {
        if (PPGame._ins == null) PPGame._ins = new PPGame();
        return PPGame._ins;
    }

    private static ENV_DEFINE = {
        local: {
            /* 晓东的机器 */
            // BASE_URL: 'http://10.1.10.254:5328/',
            // LOBBY_URL: 'http://10.1.10.254:5400/',
            /* 梁睿的机器 */
            // BASE_URL: 'http://10.1.20.239:5300/',
            /* zhouxiufen的机器 */
            //BASE_URL: 'http://10.1.10.254:5332/',
            //LOBBY_URL : 'http://10.1.10.254:5400/',

             BASE_URL: 'http://tactics.xingyunzhi.cn/5332/',
             LOBBY_URL: 'http://tactics.xingyunzhi.cn/5400/',
            RES_URL: ''
        },
        dev: {
            BASE_URL: 'http://tactics.xingyunzhi.cn/5332/',
            LOBBY_URL : 'http://tactics.xingyunzhi.cn/5400/',
            RES_URL: ''
        },
        stage: {
            BASE_URL: 'http://tactics.xingyunzhi.cn/5332/',
            LOBBY_URL : 'http://tactics.xingyunzhi.cn/5400/',
            RES_URL: ''
        },
        prodstage_asia: {
            BASE_URL: 'http://52.198.135.13:5332/',
            LOBBY_URL : 'http://52.198.135.13:5400/',
            RES_URL: ''
        },
        prod_asia: {
            BASE_URL: 'http://upgame.upliveapps.com/up_casino_slot_party_asia_api/',
            LOBBY_URL : 'http://upgame.upliveapps.com/up_casino_lobby_asia_api/',
            RES_URL: 'http://g.cdn.upliveapp.com/up_casino_slot_party_asia/'
        },
        prodstage_me: {
            BASE_URL: '',
            LOBBY_URL : '',
            RES_URL: ''
        },
        prod_me: {
            BASE_URL: '',
            LOBBY_URL : '',
            RES_URL: ''
        }
    };

    public static VERSION: number;
    public static MANIFEST_URL: string;
    public static ENV: PPGameEnv;
    public static urlParams: any = {};
    public static isLocalhost: boolean = false;
    public static EDITION: string = PPEdition.ASIA;

    private logger: any;
    private tdapp: any;
    private pageLoadTracker: any;

    public run(): void {
        // 初始化underscore
        if (!window['_']) {
            window['_'] = window['require']('underscore');
        }
        // 解析url参数
        PPGame.urlParams = this.parseQueryString(window.location.search);

        // 判断是否是开发环境
        var location: string = (window && window.location && window.location.href) + '';
        if (location) {
            if (location.indexOf('http://localhost') != -1 || location.indexOf('http://10.1.40.254') != -1) {
                PPGame.isLocalhost = true;
                PPGame.urlParams['env'] = PPGame.urlParams['env'] || 'local';
            } else if (location.indexOf('http://tactics.') != -1) {
                PPGame.isLocalhost = true;
                PPGame.urlParams['env'] = PPGame.urlParams['env'] || 'dev';
            } else if (location.indexOf('http://52.198.135.13') != -1) {
                PPGame.isLocalhost = true;
                PPGame.urlParams['env'] = 'prodstage';
            }
        }

        // 初始化加载tracker
        this.pageLoadTracker = window['PageLoadTracker'] || {};

        // 初始化talkingdata对象
        this.tdapp = window['TDAPP'] || null;
        this.trackEvent(PPTrackEvent.LOADING, PPLoadingStep.PAGE_LOAD);

        this.initEnv();

        this.modifyURL(this.getRefreshURL());

        // 启动引擎
        // 阿语在webgl下不支持从右往左渲染
        if (PPGame.urlParams['webgl'] == 0) {
            egret.runEgret({renderMode: "canvas"});
        } else {
            egret.runEgret({renderMode: "webgl"});
        }
    }

    private initEnv(): void {
        var env: string = PPGame.urlParams['env'] || 'prod';
        if (env == 'prod' || env == 'prodstage') {
            env += '_' + PPGame.EDITION;
        }

        PPGame.ENV = PPGame.ENV_DEFINE[env];

        if (!PPGame.ENV) {
            alert('invalid env');
        }
        if (env.indexOf('prod_') != -1) {
            PPGame.isLocalhost = false;
            this.disableLog();
        } else if (PPGame.ENV == PPGame.ENV_DEFINE.stage) {
            PPGame.isLocalhost = false;
        }
    }

    public reload(): void {
        if (window.location) {
            window.location.href = this.getRefreshURL();
        }
    }

    public getRefreshURL(): string {
        var searchStr = location.search;
        var url = location.href;
        var pos = url.indexOf(searchStr);
        if (pos > 0) url = url.substring(0, pos);
        url += '?v=' + PPGame.VERSION;
        if (PPGame.isLocalhost && PPGame.urlParams['env']) {
            url += '&env=' + PPGame.urlParams['env'];
        }
        return url;
    }

    public trackEvent(eventId: string, label?: string, mapKv?: any): void {
        if (eventId == PPTrackEvent.LOADING) {
            switch (label) {
                case PPLoadingStep.MANIFEST_LOAD:
                    this.pageLoadTracker.manifestLoaded = true;
                    break;
                case PPLoadingStep.RES_CONFIG_LOAD:
                    this.pageLoadTracker.resConfigLoaded = true;
                    break;
                case PPLoadingStep.LOADING_VIEW_LOAD:
                    this.pageLoadTracker.loadingViewLoaded = true;
                    break;
            }
        }

        if (!this.tdapp) return;
        console.log('trackEvent', eventId, label);

        if (label && mapKv) {
            this.tdapp.onEvent(eventId, label, mapKv);
        } else if (label) {
            this.tdapp.onEvent(eventId, label);
        } else {
            this.tdapp.onEvent(eventId);
        }
    }

    private parseQueryString(str: string): any {
        var reg = /(([^?&=]+)(?:=([^?&=]*))*)/g;
        var result = {};
        var match;
        var key;
        var value;
        while (match = reg.exec(str)) {
            key = match[2];
            value = match[3] || '';
            result[key] = decodeURIComponent(value);
        }
        return result;
    }

    private modifyURL(newURL: string, title?: string, pushState?: boolean) {
        if (window.history) {
            var stateObject = {};
            var newURL = newURL || location.href;
            var title = title || document.title;
            if (pushState) {
                window.history.pushState(stateObject, title, newURL);
            } else {
                window.history.replaceState(stateObject, title, newURL);
            }
        }
    }

    public disableLog(): void {
        this.logger = {
            log: console.log,
            error: console.error
        };
        console.log = console.error = function () {
        };
    }
}

class PPTrackEvent {
    public static LOADING:string = 'loading';
    public static PAY:string = 'pay';
}

class PPLoadingStep {
    public static PAGE_LOAD:string = 'page_load';
    public static MANIFEST_LOAD_BEGIN:string = 'manifest_load_begin';
    public static MANIFEST_LOAD:string = 'manifest_load';
    public static MANIFEST_PARSE_FAIL:string = 'manifest_parse_fail';
    public static RES_CONFIG_LOAD:string = 'res_config_load';
    public static LOADING_VIEW_LOAD:string = 'loading_view_load';
    public static RES_LOAD:string = 'res_load';
    public static LOGIN:string = 'login';
}

class PPPayStep {
    public static REQUEST_PAY:string = 'request_pay';//请求支付
    public static SUCESS_PAY:string = 'sucess_pay';//支付成功
}