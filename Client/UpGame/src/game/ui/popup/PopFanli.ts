/**
 * Created by a123 on 17-1-22.
 */
module ui {

    export class PopFanli extends BasePopup {
        public _data:any;
        private _converTimes:number;
        private _Timer:egret.Timer;

        public constructor() {
            super('slots', 'popup_fanli');
        }

        protected onUpdate(...args):void {
            this._data = args[0];
            this.initUi(args[0]);
            //ui.UIUtils.fitScale(this.view.getChild('jiangdanjpg').asLoader , fairygui.GRoot.inst.width, fairygui.GRoot.inst.height);
        }

        protected onLoaderNeedToDealWith(loader:fairygui.GLoader):boolean{
            //if(loader.name == 'jiangdanjpg'){
            //    loader.url = 'resource/assets/dynamic/jiangdan.jpg';
            //    return false;
            //}
            console.log('---->onLoaderNeedToDealWith');
            return true;
        }

        protected initUi(result:any):void{
            //this._converTimes = model.GeneralServerRequest.getServerTime();
            var n49 = this.view.getChild('n49');
            n49.addClickListener(this.onClick, this);

            var dia = this._data.totalCostDiamond?this._data.totalCostDiamond:0;
            var n55 = this.view.getChild('n55').asTextField;//直播間已消費U鑽數
            n55.text = game.Tools.lang(dia);

            var n56 = this.view.getChild('n56').asTextField;//今日已獲取免費次數
            //var t = this._data.convertTimes?this._data.convertTimes:0;
            var t = Math.floor(dia/1000);
            n56.text = game.Tools.lang(t);

            var leftDiamond = this._data.leftDiamond?this._data.leftDiamond:0;
            var n57 = this.view.getChild('n57').asTextField;//距下次次數所需鑽數
            n57.text = game.Tools.lang(leftDiamond);


            var lt = this._data.leftConvertTimes ?this._data.leftConvertTimes:0;
            var n59 = this.view.getChild('n59').asTextField;//未領取的免費次數
            n59.text = game.Tools.lang(lt);

            //lt = 1;
            n49.enabled = lt>0?true:false;
            n49.asCom.getController('c1').selectedIndex = lt>0?0:1;

            //if(!this._Timer){
            //    this._Timer = new egret.Timer(1000);
            //    this._Timer.addEventListener(egret.TimerEvent.TIMER, this.onTimerFunc, this);
            //    this._Timer.start();
            //}
            //
            //this.onTimerFunc();
        }

        public onHide():void{
            super.onHide();
            if(this._Timer){
                console.log('=====>_onLineAwardTimer.stop');
                this._Timer.stop();
                this._Timer.removeEventListener(egret.TimerEvent.TIMER,this.onTimerFunc,this);
                this._Timer = null;
            }
        }

        /*
         * 在线奖励定时器回调
         */
        public onTimerFunc():void{
            var contime = game.TimeUtil.getServerDate();

            var a = contime.getDayOfMonth();
            var b = contime.getDayOfWeek();
            var c = contime.getHour();
            var d = contime.getMiliSec();
            var e = contime.getMinute();
            var f = contime.getMonthOfYear();
            var g = contime.getOriginalDate();
            var h = contime.getSecond();
            var i = contime.getYear();


            var time = 24*60*60*1000 - c*60*60*1000 - e*60*1000 - h*1000;
            var tt = game.TimeUtil.timeLeftToTimeFormat(time);

            var n58 = this.view.getChild('n58').asTextField;//重置时间
            n58.text = game.TimeUtil.timeLeftToTimeFormat(time);


        }

        private onClick():void {
            //model.UserModel.Ins.freeTimes = 10;
            //game.UIEvent.SLOT_COST.dispatch();
            //return;
/*
 todayCostDiamond : 最新消费总额
 freeTimes:  用户最新免费次数
 convertTimes: 当天已兑换次数
 leftConvertTimes: 0 剩余兑换次数
 */
            model.UserModel.Ins.convertFreeTimes(function (result) {
                this._data.totalCostDiamond = result.totalCostDiamond?result.totalCostDiamond:0;
                this._data.leftConvertTimes = result.leftConvertTimes?result.leftConvertTimes:0;
                this._data.convertTimes = result.convertTimes?result.convertTimes:0;
                this._data.leftDiamond = result.leftDiamond?result.leftDiamond:0;
                model.UserModel.Ins.freeTimes = result.freeTimes?result.freeTimes:0;
                game.UIEvent.SLOT_COST.dispatch();
                this.initUi(null);
            }, this);

        }

    }

}