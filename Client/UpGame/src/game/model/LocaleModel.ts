/**
 * Created by huangqingfeng on 16/7/25.
 */
module model {

    export class LocaleModel {

        public static zh_TW:string = 'zh_TW';
        public static AR:string = 'ar';

        public static SUPPORTED_LANGUAGES:string[] = [];

        private static _ins:LocaleModel;
        public static get Ins():LocaleModel {
            if (!this._ins) this._ins = new LocaleModel();
            return this._ins;
        }

        public static DEFAULT_LOCALE:string = LocaleModel.zh_TW;

        private _locale:string;
        private _data:any;
        private _loaderMap:any;

        public get locale():string {
            // 只初始化一次
            // if (!this._locale) {
            //     var v = egret.localStorage.getItem('user_locale');
            //     if (this.isValidLocale(v)) {
            //         this._locale = v;
            //     }
            // }
            // console.log('get locale', this._locale);
            //return ""
            return this._locale;
        }

        public set locale(v:string) {
            // console.log('set locale,', v);
            this._locale = v;
            // if (this.isValidLocale(v)) {
            //     egret.localStorage.setItem('user_locale', v);
            //     // 游戏运行过程中，只能设置一次locale
            //     if (!this._locale) {
            //         this._locale = v;
            //     }
            // }
        }

        private isValidLocale(locale:string):boolean {
            var isValid = false;
            if (locale) {
                for (var i = 0; i < LocaleModel.SUPPORTED_LANGUAGES.length; i++) {
                    if (LocaleModel.SUPPORTED_LANGUAGES[i] == locale) {
                        isValid = true;
                        break;
                    }
                }
            }
            return isValid;
        }
        
        public init():void {
            if (!!this._data) return;

            this._loaderMap = LOCALE_LOADER_MAP[this.locale];

            var l:any = RES.getRes('locale_' + this.locale);
            if (!!l) {
                console.log('[Locale]', 'init success', this.locale);
                this._data = l;
                if (this.locale != LocaleModel.zh_TW) {
                    fairygui.UIPackage['_stringsSource'] = this._data;
                }
            }
        }

        /*
        * 获取字符串
        * */
        public getString(key:string):string {
            this.init();

            // var debug:boolean = false;
            // if (key && key.indexOf && key.indexOf('一键领取') != -1) {
            //     debug = true;
            //     console.log('[LocaleModel]', 1, JSON.stringify(key));
            // }
            key = this.customTrim(key);
            key = game.Tools.removeCarriageReturn(key);
            // if (debug) {
            //     console.log('[LocaleModel]', 2, JSON.stringify(key));
            // }
            if (this._data && this._data[key]) {
                // if (debug) {
                //     console.log('[LocaleModel]', 3, JSON.stringify(key));
                // }
                return this._data[key];
                // return game.Tools.slashAndReturnParse(key, true);
            } else {
                return key;
            }
        }

        private customTrim(str:string):string {
            if (!!str && str.length > 0) {
                if (str.charAt(0) == ' ') {
                    str = str.substr(1);
                }
                if (str.charAt(str.length - 1) == ' ') {
                    str = str.substr(0, str.length - 1);
                }
            }
            return str;
        }

        public getLocaleLoaderResource(name:string):string {
            if (!this._loaderMap) return name;

            for (var key in this._loaderMap) {
                if (name.search(key) != -1) {
                    name = name.replace(key, this._loaderMap[key]);
                    return name;
                }
            }
            return name;
        }
    }

    export class LOCALE_LOADER_MAP {
        public static zh_CN:any = {
            'dynamic/baihu.jpg': 'dynamic_zh_CN/baihu.jpg'
        };

        public static zh_TW:any = {
            'dynamic/login_ani_bg4.jpg': 'dynamic_zh_TW/login_ani_bg4.jpg'
        };

        public static en_US:any = {
            'dynamic/baihu.jpg': 'dynamic_en_US/baihu.jpg'
        };
    }
}