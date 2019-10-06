/**
 * Created by huangqingfeng on 16/7/18.
 */
module game {

    export class TimeUtil {

        public static MILI_SEC_OF_SEC:number = 1000;
        public static MILI_SEC_OF_MINUTE:number = TimeUtil.MILI_SEC_OF_SEC * 60;
        public static MILI_SEC_OF_HOUR:number = TimeUtil.MILI_SEC_OF_MINUTE * 60;
        public static MILI_SEC_OF_DAY:number = TimeUtil.MILI_SEC_OF_HOUR * 24;

        private static _date:DateStruct = DateStruct.createFromPool();

        /*
         * 倒计时转换成倒计时文字
         *
         * @param leftMiliSec 倒计时的毫秒数
         * @param format 格式,格式中的{hh}会被替换成小时数, {mm}分钟,{ss}秒,{ms}毫秒
         * @param delimeter 用来区分format中的分隔符,在提供了format的情况下必须提供此字段
         * */
        public static timeLeftToTimeFormat(leftMiliSec:number, format:string = '{hh}:{mm}:{ss}', delimeter:string = ':'):string {
            var formats:string[] = format.split(delimeter),
                result:string[] = [];
            if (formats && formats.length) {
                var split:string;
                while (formats.length) {
                    split = formats.shift();
                    if (split.match('{h}') || split.match('{hh}')) {
                        var h:number = Math.floor(leftMiliSec / 3600000);
                        split = split.replace('{h}', h + '');
                        split = split.replace('{hh}', h < 10 ? '0' + h : h + '');
                        result.push(split);
                    } else if (split.match('{m}') || split.match('{mm}')) {
                        var m:number = Math.floor(leftMiliSec % 3600000 / 60000);
                        split = split.replace('{m}', m + '');
                        split = split.replace('{mm}', m < 10 ? '0' + m : m + '');
                        result.push(split);
                    } else if (split.match('{s}') || split.match('{ss}')) {
                        var s:number = Math.floor(leftMiliSec % 3600000 % 60000 / 1000);
                        split = split.replace('{s}', s + '');
                        split = split.replace('{ss}', s < 10 ? '0' + s : s + '');
                        result.push(split);
                    } else if (split.match('{ms}') || split.match('{ms}')) {
                        var ms:number = Math.floor(leftMiliSec % 1000);
                        split = split.replace('{ms}', ms + '');
                        result.push(split);
                    }
                }
            }
            return result.join(delimeter);
        }

        /*
         * 时间转日期,目前只支持年月日三个级别
         * */
        public static timeToDate(timestamp:number, format:string = '{yyyy}-{mm}-{dd}', delimeter:string = '-'):string {
            TimeUtil._date.update(timestamp);
            var result:string[] = [];

            var formats:string[] = format.split(delimeter),
                split:string;
            while (formats.length) {
                split = formats.shift();
                if (split.match('{yyyy}') || split.match('{yy}')) {
                    var y:string = TimeUtil._date.getYear() + '';
                    var year:string = split.match('{yy}') ? y.substr(y.length - 2) : y;
                    result.push(year);
                } else if (split.match('{mm}')) {
                    var m:string = TimeUtil._date.getMonthOfYear() + '';
                    var month:string = m.length < 2 ? '0' + m : m;
                    result.push(month);
                } else if (split.match('{dd}')) {
                    var d:string = TimeUtil._date.getDayOfMonth() + '';
                    var day:string = d.length < 2 ? '0' + d : d;
                    result.push(day);
                }
            }

            return result.join(delimeter);
        }

        public static YEAR:string = 'year';
        public static MONTH:string = 'month';
        public static DATE:string = 'date';
        public static HOUR:string = 'hour';
        public static MINUTE:string = 'minute';
        public static SECOND:string = 'second';
        public static MILISEC:string = 'milisec';
        /*
        * 比较日期,是否同一时间
        * */
        public static compareDate(ds1:DateStruct, ds2:DateStruct, level:string = 'date'):number {
            var year:number = ds1.getYear() - ds2.getYear();
            if (year != 0) return year > 0 ? 1 : -1;
            if (level == TimeUtil.YEAR) return 0;

            var month:number = ds1.getMonthOfYear() - ds2.getMonthOfYear();
            if (month != 0) return month > 0 ? 1 : -1;
            if (level == TimeUtil.MONTH) return 0;

            var date:number = ds1.getDayOfMonth() - ds2.getDayOfMonth();
            if (date != 0) return date > 0 ? 1 : -1;
            if (level == TimeUtil.DATE) return 0;

            var hour:number = ds1.getHour() - ds2.getHour();
            if (hour != 0) return hour > 0 ? 1 : -1;
            if (level == TimeUtil.HOUR) return 0;

            var minute:number = ds1.getMinute() - ds2.getMinute();
            if (minute != 0) return minute > 0 ? 1 : -1;
            if (level == TimeUtil.MINUTE) return 0;

            var second:number = ds1.getSecond() - ds2.getSecond();
            if (second != 0) return second > 0 ? 1 : -1;
            if (level == TimeUtil.SECOND) return 0;

            var ms:number = ds1.getMiliSec() - ds2.getMiliSec();
            if (ms != 0) return ms > 0 ? 1 : -1;
            if (level == TimeUtil.MILISEC) return 0;

            return 0;
        }

        public static compareMisliSec(ds1:DateStruct, ds2:DateStruct):number {
            var ms1:number = ds1.getMiliSec(), ms2:number = ds2.getMiliSec();
            if (ms1 == ms2) {
                return 0;
            } else if (ms1 < ms2) {
                return -1;
            } else {
                return 1;
            }
        }

        /*
        * 通过毫秒数获取一个更舒服的日期结构
        * */
        public static getDate(milisec:number):DateStruct {
            var ds:DateStruct = DateStruct.createFromPool();
            ds.update(milisec);
            return ds;
        }

        /*
        * 获取服务器日期
        * */
        public static getServerDate():DateStruct {
            return this.getDate(model.GeneralServerRequest.getServerTime());
        }

    }

}