module game {
    export class Tools {

        /*
        * 是否包含中文
        */
        public static strHasChineseChar(str:string):boolean {
            if (!!str && str.length > 0) {
                return str != str.replace(/^[\u4E00-\u9FA5]/g,'');
            }
            return false;
        }

        /*
        * 字符串是否数字
        */
        public static isStrNumber(str:string):boolean {
            if (!!str && str.length > 0) {
                return str == parseInt(str) + '';
            }
            return false;
        }

        /*
        * 字符串是否英文
        */
        public static isStrAlphabetic(str:string):boolean {
            if (!!str && str.length > 0) {
                return str != str.replace(/[a-zA-Z]/g,'');
            }
            return false;
        }

        /*
        * 获取一个字符串的字节长度
        * */
        public static getTextCharLength(str:string):number {
            var len:number = 0;
            if (!str) return len;
            for (var i:number = 0; i < str.length; i ++) {
                if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94)
                    len += 2;
                else
                    len += 1;
            }
            return len;
        }

        /*
        * 截取字符串
        * */
        public static stripTextToLength(str:string, maxLength:number, isChar:boolean = false):string {
            var len = isChar ? Tools.getTextCharLength(str) : str.length;
            while (len > maxLength) {
                str = str.substring(0, str.length - 1);
                len = isChar ? Tools.getTextCharLength(str) : str.length;
            }
            return str;
        }

        public static GetDistance(p1: egret.Point, p2: egret.Point): number {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        }
        
        public static getAngle(beginPoint,endPoint): number {
            var len_y = endPoint.y - beginPoint.y;
            var len_x = endPoint.x - beginPoint.x;


            if(len_y == 0.0) {
                if(len_x < 0) {
                    return 270;
                }
                else if(len_x > 0) {
                    return 90;
                }
                return 0;
            }

            if(len_x == 0.0) {
                if(len_y >= 0) {
                    return 0;
                }
                else if(len_y < 0) {
                    return 180;
                }
            }


            return Math.atan2(len_x,len_y) * 180 / 3.1415926;

        }

        public static getDir(beginPoint,endPoint): string {
            var len_y = endPoint.y - beginPoint.y;
            var len_x = endPoint.x - beginPoint.x;


            if(len_y == 0.0) {
                if(len_x < 0) {
                    return  "left";
                }
                else if(len_x > 0) {
                    return "right";
                }
                return "top";
            }

            if(len_x == 0.0) {
                if(len_y >= 0) {
                    return "top";
                }
                else if(len_y < 0) {
                    return "bottom";
                }
            }

            if(len_y > 0){//上面
                if(endPoint.x > beginPoint.x){
                    return "topRight"
                }else if(endPoint.x < beginPoint.x){
                    return "topLeft"
                }
            }

            if(len_y < 0){
                if(endPoint.x > beginPoint.x){
                    return "bottomRight"
                }else if(endPoint.x < beginPoint.x){
                    return "bottomLeft"
                }
            }
            return "top"

        }

        public static randInt(start,end): number {
            return start + Math.floor(Math.random() * (end - start));
        }

        public static loadGameConfig():any {
            var allConfig = RES.getRes('game_config_json');
            var config = allConfig['config'];
            var chineseRegExp = /[\u4E00-\u9FA5\uF900-\uFA2D]+/g;

            var gameConfig = {};
            var t = egret.getTimer();

            for(var key in config){

                gameConfig[key] = {all : [], map : {}};

                var tempConfig = allConfig[key];

                var mainKey = config[key][0];
                var secKey = config[key][1];

                for(var i = 0, len = tempConfig.length; i < len; i++){

                    // 尝试替换多语言
                    for (var subKey in tempConfig[i]) {
                        if (chineseRegExp.test(tempConfig[i][subKey])) {
                            tempConfig[i][subKey] = game.Tools.lang(tempConfig[i][subKey]);;
                        }
                    }

                    gameConfig[key].all.push( tempConfig[i] );

                    if(!!mainKey) {
                        var tempId = tempConfig[i][mainKey];
                        gameConfig[key].map[ tempId ] = gameConfig[key].map[ tempId ] || {};

                        if(!!secKey){
                            gameConfig[key].map[ tempId ][ secKey ] = gameConfig[key].map[ tempId ][ secKey ] || {};
                            gameConfig[key].map[ tempId ][ secKey ] [tempConfig[i][secKey]] = tempConfig[i];
                        } else {
                            gameConfig[key].map[ tempId ] = tempConfig[i];
                        }
                    }
                }
            }
            console.log('parse config:', egret.getTimer() - t, 'ms');
            return gameConfig;
        }

        public static removeCarriageReturn(str:string):string {
            str += '';
            return str.replace(/\\r/g, '\r').replace(/\r/g, '');
        }

        public static slashAndReturnParse(str:string, viseversa:boolean = false):string {
            if (viseversa) {
                if (!!str && str.length > 0) {
                    if (str.search(/\\r/) != -1) {
                        str = str.replace(/\\r/g, '\r');
                    }
                    if (str.search(/\\n/) != -1) {
                        str = str.replace(/\\n/g, '\n');
                    }
                    return str;
                }
                return str;
            } else {
                if (!!str && str.length > 0) {
                    if (str.search(/\r/) != -1) {
                        str = str.replace(/\r/g, '\\r');
                    }
                    if (str.search(/\n/) != -1) {
                        str = str.replace(/\n/g, '\\n');
                    }
                    return str;
                }
                return str;
            }
        }

        // 语言翻译
        public static lang(...args):string{
            var str = arguments[0];
            var langStr = model.LocaleModel.Ins.getString(str);
            if (!!langStr && langStr.length > 0) {
                for(var i = 1; i < arguments.length; i++){
                    langStr = langStr.replace("%c", arguments[i]);
                }
            }
            return langStr;
        }

        private static SYMBOLS:string[] = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
        private static UNITS:string[] = ['', '十', '百', '千', '万'];
        /*
        * 数字变中文,目前只支持正整数部分,而且目前只支持到万级!
        *
        * @param readable 作用举例: 传入数字是101, 设置为true时返回"一百零一", 设置为false时返回"一零一".
        * */
        //noinspection TypeScriptValidateTypes
        public static getChineseNumber(num:Number, readable?:boolean):string {
            if (num < 0) return '';

            var result:string = '';
            var splits:string[] = (num + '').split('.'),
                intPart:string = splits.shift(),
                decPart:string = splits.length ? splits.shift() : null;
            
            // 过滤尾部两个及以上的0
            if (readable) {
                intPart = intPart.replace(/0+$/g, function (str:string, ...args:any[]):string {
                    var s:string = '';
                    for (var i:number = 0; i < str.length; i++) {
                        s += ' ';
                    }
                    return s;
                });
            }

            // 12300 -> 1 2 3 ' ' ' '
            splits = intPart.split('');
            var v:number, pv:number;
            for (var i:number = 0; i < splits.length; i ++) {
                if (splits[i] == ' ') continue;
                v = parseInt(splits[i], 10);
                if (v == 0 && i > 0 && readable) {
                    pv = parseInt(splits[i - 1], 10);
                    if (pv == v) continue;
                }
                result += Tools.SYMBOLS[v];
                if (v != 0 && readable) {
                    result += Tools.UNITS[splits.length - i - 1];
                }
            }

            return result;
        }

        /*
        * 类型判断
        *
        * @param t 要判断的对象
        * @param cmp 要判断的类型
        * */
        public static is(t:any, cmp:any):boolean {
            var type:string = typeof t,
                cmpType:string = typeof cmp;

            // this.log(`target type is /${type}/, and compare type is /${cmpType}/`);

            if (t === undefined || type === undefined) return false;

            if (t === cmp) return true;
            if (type === cmp) return true;

            switch (cmp) {
                case String :
                    if (type === 'string') return true;
                    break;
                case Number :
                    if (type === 'number') return true;
                    break;
                case Boolean :
                    if (type === 'boolean') return true;
                    break;
                case Array :
                    if (type === 'array') return true;
                    break;
            }

            if (cmpType === 'function') {
                return t instanceof cmp;
            } else {
                return type === cmpType;
            }
        }

        /*
        * 超时处理通用方法,其实是单次计时功能
        *
        * @param time 毫秒数
        * */
        public static timeout(time:number, cb:Function, context:any, ...params):number {
            if (time > 0) {
                var ts:number = setTimeout(function ():void {
                    game.Tools.clearTimeout(ts);

                    if (cb) cb.apply(context, params);
                }, time);
                return ts;
            }
            return -1;
        }

        /*
        * 清除上一步的超时
        * */
        public static clearTimeout(id:number):void {
            if (id != -1)
                clearTimeout(id);
        }

        public static clone(obj:any):any{
            var o;
              if (typeof obj == "object") {
                    if (obj === null) {
                            o = null;
                        } else {
                            if (obj instanceof Array) {
                                    o = [];
                                 for (var i = 0, len = obj.length; i < len; i++) {
                                              o.push(game.Tools.clone(obj[i]));
                                         }
                                  } else {
                                    o = {};
                                    for (var j in obj) {
                                            o[j] = game.Tools.clone(obj[j]);
                                          }
                                   }
                            }
                  } else {
                       o = obj;
                  }
              return o;
        }

        public static strlen(str:string):number{
            var len = 0;
            for (var i=0; i<str.length; i++) {
                var c = str.charCodeAt(i);
                //单字节加1
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                    len++;
                }
                else {
                    len+=2;
                }
            }
            return len;
        }

        public static  getFormatText(text:string , maxLen:number=10):string{
            var str = "";
            var len = 0;
            maxLen = maxLen || 10;
            for(var i=0; i < text.length; i ++){

                if(len < maxLen){
                    len = len + Tools.strlen(text[i]);
                    str = str + text[i];
                }else{
                    len = len + Tools.strlen("...");
                    str = str + "...";
                    break;
                }

            }
            return str;
        }
    }
} 