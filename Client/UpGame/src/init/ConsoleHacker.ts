module init {

    export class ConsoleHacker extends BaseInit {

        public constructor() {
            super();
        }

        protected handler_web():void {
            var d:Date = new Date(),
                t:number = egret.getTimer(), 
                log:Function = console.log;
            console.log = function (...args):void {
                d = new Date();
                d.setTime(d.getTime() + egret.getTimer() - t);
                var h:number = d.getHours(),
                    m:number = d.getMinutes(),
                    s:number = d.getSeconds();
                var ts:string = `[${h < 10 ? `0${h}` : h}:${m < 10 ? `0${m}` : m}:${s < 10 ? `0${s}` : s}]`;
                args.unshift(ts);
                log.apply(console, args);
            }
        }

        protected handler_native():void {
            var log:Function = console.log;
            console.log = function ():void {
                var args = [];
                for (var i = 0; i < arguments.length; i++) {
                    args.push(arguments[i]);
                }
                log.apply(console, [args.join(' ')]);
            }
        }

    }

}