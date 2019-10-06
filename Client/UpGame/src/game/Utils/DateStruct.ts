/**
 * Created by huangqingfeng on 16/7/18.
 */
module game {

    /*
     * 更人性化的日期结构
     * */
    export class DateStruct {

        private static _pool:DateStruct[] = [];
        public static createFromPool():DateStruct {
            var d:DateStruct;
            if (this._pool.length == 0) {
                d = new DateStruct();
            } else {
                d = this._pool.shift();
            }

            return d;
        }

        private _date:Date;

        /*
         * 返回到池里
         * */
        public returnToPool():void {
            if (DateStruct._pool)
                DateStruct._pool.push(this);
        }

        /*
         * 通过毫秒数更新该日期,在使用该类前,该方法应该至少被调用一次
         *
         * @param miliSec 从1970/01/01开始的毫秒数
         * */
        public update(miliSec:number):void {
            if (!this._date) this._date = new Date();
            this._date.setTime(miliSec);
        }

        /*
        * 通过Date的构造函数来创建日期.
        */
        public create(argument:any):void {
            this._date = new Date(argument);
        }

        /*
         * 用毫秒数的数值差更新该日期
         *
         * @param miliSec 传入正数为时间往后(如1970/01/01 - 1980/02/03),传入负数为时间往前(如1980/02/03 - 1970/01/01)
         * */
        public offset(miliSec:number):void {
            if (this._date) {
                this._date.setTime(this._date.getTime() + miliSec);
            }
        }

        /*
         * 获取当前的日期实例
         * */
        public getOriginalDate():Date {
            return this._date;
        }

        /*
         * 获取当前日期的毫秒数
         * */
        public getMiliSec():number {
            return this.getOriginalDate().getTime();
        }

        /*
         * 一周里面的天数,返回值从1-7,而不是0-6
         *
         * @return number 1到7,即周一到周茹
         * */
        public getDayOfWeek():number {
            var day:number = this.getOriginalDate().getDay();
            return day == 0 ? 7 : day;
        }

        /*
         * 当前的年份
         *
         * @return number
         * */
        public getYear():number {
            return this.getOriginalDate().getFullYear();
        }

        /*
         * 返回当前的月份,从1-12,而不是0-11
         *
         * @return number 1到12,也就是一月到十二月
         * */
        public getMonthOfYear():number {
            var m:number = this.getOriginalDate().getMonth();
            return m + 1;
        }

        /*
         * 当前的日期,一个月里的某一天
         *
         * @return number
         * */
        public getDayOfMonth():number {
            var d:number = this.getOriginalDate().getDate();
            return d;
        }

        /*
         * 当前的日期,小时数
         *
         * @return number
         * */
        public getHour():number {
            var h:number = this.getOriginalDate().getHours();
            return h;
        }

        public getMinute():number {
            var m:number = this.getOriginalDate().getMinutes();
            return m;
        }

        public getSecond():number {
            var s:number = this.getOriginalDate().getSeconds();
            return s;
        }

    }

}