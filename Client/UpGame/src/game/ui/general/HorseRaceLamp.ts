/**
 * Created by zhaikaiyu on 16/12/23.
 */
module ui {

    export class HorseRaceLamp {

        public static WHITE:number = 0xFFFFFF;

        private static WHITE_STROKE:number = 0x000000;
        public static YELLOW:number = 0xFDDA61;
        private static YELLOW_STROKE:number = 0x561312;

        private static RACE_TIME:number = 1000;
        private static OPT_IN_TIME:number = 3000;

        protected static TOASTERS_POOL:HorseRaceLamp[] = [];
        protected static TOASTERS_SHOWING:HorseRaceLamp[] = [];
        private static itemPools = [];
        private static totalPools = [];
        private static current:HorseRaceLamp;
        public static _color:string;
        private static _timeTick:any;
        private static _container:fairygui.GComponent;
        private static _time:number = 0;
        private static isPlay = false;
        private static _side = 0;
        public static init(container:fairygui.GComponent, side:number=0):void{
            //HorseRaceLamp.itemPools.push("玩家侯大帅鴻運當頭，賺到了20鑽!!","玩家侯小帅好運連連，賺到了10鑽!")
            HorseRaceLamp._timeTick = HorseRaceLamp.updateHandler;
            this._time = egret.getTimer();
            egret.startTick(HorseRaceLamp._timeTick,HorseRaceLamp);
            HorseRaceLamp._container = container;
            HorseRaceLamp._side = side;
            //HorseRaceLamp.startHorseRace();
            // HorseRaceLamp._timeCounter = new TimeCounter(HorseRaceLamp.OPT_IN_TIME);
            //HorseRaceLamp._timeCounter.setUpdateCallback(HorseRaceLamp.updateHandler,HorseRaceLamp);
            //HorseRaceLamp._timeCounter.start();
            HorseRaceLamp.getNotice();

        }

        public static isDiff(obj):boolean{
            var bl = false;
            for(var i = 0; i < HorseRaceLamp.totalPools.length; i++){
                if(HorseRaceLamp.totalPools[i].createTime == obj.createTime){
                    bl = true;
                    break;
                }
            }
            return bl;
        }

        public static getNotice():void{
            model.UserModel.Ins.getNotice(function (result) {
                var notice = result.notices;
                if(notice && notice.length > 0){
                    for(var i = 0; i < notice.length; i++){
                        if(!HorseRaceLamp.isDiff(notice[i])){
                            HorseRaceLamp.totalPools.unshift(notice[i])
                            HorseRaceLamp.itemPools.unshift(notice[i])
                        }
                    }
                }

                if(HorseRaceLamp.totalPools.length > 100){
                    HorseRaceLamp.totalPools.splice(100)
                }

                if(HorseRaceLamp.itemPools.length > 100){
                    HorseRaceLamp.itemPools.splice(100)
                }
                if(!HorseRaceLamp.isPlay){
                    HorseRaceLamp.startHorseRace();
                }
            },this)
        }

        public static updateHandler(timeStamp, paused):void{
            var delTime = timeStamp - this._time;
            if(delTime > 300000){
                this._time = egret.getTimer();
                HorseRaceLamp.getNotice();
            }
        }

        public static startHorseRace():void{
            if(HorseRaceLamp.itemPools && HorseRaceLamp.itemPools.length > 0){
                this.isPlay = true;
                var contentObj = HorseRaceLamp.itemPools.shift();
                //HorseRaceLamp.itemPools.push(content);
                HorseRaceLamp.create(contentObj)

                game.GameEvent.DISPLAY_HORSERACELAMP.dispatch(true);
            }else{
                this.isPlay = false;
                game.GameEvent.DISPLAY_HORSERACELAMP.dispatch(false);
            }
        }

        public static create(contentObj:any, color:number = HorseRaceLamp.WHITE):HorseRaceLamp {
            var t:HorseRaceLamp = this.get();
            //if(costObj && costObj[arrItem[i]] <= hasNum){
            //    str = "[color=#ffffff]" +hasNum+"[/color]"
            //}else{
            //    str = "[color=#fef170]" +hasNum+"[/color]"
            //}
            //itemHas.text = str;
            var labelStr = ""
            if(contentObj.quality == 3){
                labelStr = game.Tools.lang("[color=#ffff00]%c[/color]在%c在%c中,鴻運當頭，賺到[color=#ffff00]%c[/color]U鑽!",game.Tools.getFormatText(contentObj.username, 30),contentObj.gameName,contentObj.diamond);
            }else{
                labelStr = game.Tools.lang("[color=#ffff00]%c[/color]在%c中,好運連連，賺到[color=#ffff00]%c[/color]U鑽!",game.Tools.getFormatText(contentObj.username, 30),contentObj.gameName,contentObj.diamond);
            }
            t.content = labelStr;
            t.color = color;
            //t.strokeColor = color === HorseRaceLamp.WHITE ? HorseRaceLamp.WHITE_STROKE : HorseRaceLamp.YELLOW_STROKE;
            HorseRaceLamp.current = t;
            HorseRaceLamp._container.displayListContainer.addChild(t.text.displayObject);
            return t;
        }

        private static get():HorseRaceLamp {
            var t:HorseRaceLamp = null;
            if (this.TOASTERS_POOL.length > 0) {
                t = this.TOASTERS_POOL.shift();
            } else {
                t = new ui.HorseRaceLamp();
            }
            this.TOASTERS_SHOWING.push(t);
            return t;
        }

        private _content:string = "";
        private _text:fairygui.GTextField;
        private static _t:number = HorseRaceLamp.RACE_TIME / 4;

        public constructor() {
            this._text = new fairygui.GTextField()
            this._text.ubbEnabled = true;
            this._text.fontSize = 22;
            // this._text.align = fairygui.AlignType.Right;
            // this._text.width = ui.UILayer.ACTUAL_WIDTH;
            // this._text.autoSize = fairygui.AutoSizeType.Both;
        }

        public get text():fairygui.GTextField {
            return this._text;
        }

        public set content(value:string) {
            this._content = value;
            this._text.text = this._content;
            this._text.y = 0;
            this._text.x = UILayer.ACTUAL_WIDTH;
            this._text.alpha = 1;
            // this._text.displayObject.cacheAsBitmap = true;
            // egret.Tween.get(this._text)
            //     .to({"alpha" : 1}, 2000)
            //     .to({"alpha" : 0, "x": 0}, 4000)
            //     .call(this.hide, this);
            this.animationSeq();
        }

        private animationSeq():void {
            //var s = this._text.width
            //var ls = UILayer.ACTUAL_WIDTH;
            //console.log('---->s:',s);
            //console.log('---->ls:',ls);
            //console.log('---->_side:',HorseRaceLamp._side);
            var tox = 0;
            //if(s > ls-HorseRaceLamp._side){
            //    var tox = ls-HorseRaceLamp._side-s;
            //}
            egret.Tween.get(this._text)
                .to({"x": tox}, HorseRaceLamp.RACE_TIME)
                .wait(4000)
                .call(this.hide, this);

            // egret.Tween.get(this._text)
            //     .to({"alpha": 1}, HorseRaceLamp._t)
            //     .wait(2000)
            //     .to({"alpha": 0}, HorseRaceLamp._t);
                // .call(function ():void {
                //     egret.Tween.get(this._text)
                //         .to({}, 2000)
                //         .call(function ():void {
                //             egret.Tween.get(this._text)
                //                 .to({"alpha": 0}, 1000)
                //         }, this);
                // }, this);
        }

        public set color(color:number){
            this._text.color = color;
        }

        public set strokeColor(color:number) {
            this._text.stroke = 2;
            this._text.strokeColor = color;
        }

        public get content():string {
            return this._content;
        }

        public hide():void {
            egret.Tween.removeTweens(this._text);
            this.onHide();
            HorseRaceLamp.startHorseRace();
        }

        public static dispose():void{
            HorseRaceLamp._container = null;
            egret.stopTick(HorseRaceLamp._timeTick,HorseRaceLamp)
            //HorseRaceLamp._timeCounter.stop();
            //HorseRaceLamp._timeCounter = null;
        }

        private onHide():void {
            // this._text.removeFromParent();
            // fairygui.GRoot.inst.removeChild(this._text);
            this._content = "";
            this._text.text = "";
            this._text.alpha = 1;
            ui.HorseRaceLamp.TOASTERS_SHOWING.splice(ui.HorseRaceLamp.TOASTERS_SHOWING.indexOf(this), 1);
            ui.HorseRaceLamp.TOASTERS_POOL.push(this);
        }

    }

}