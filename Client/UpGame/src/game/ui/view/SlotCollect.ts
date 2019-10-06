/**
 * Created by a123 on 17-3-20.
 * 收集栏
 */
module view{
    export class COLLECTCODE{
        public static COMPLETE:number = 0;
        public static FAILED:number = -1;
        public static COLLECTING:number = 1;
    }

    export class SlotCollect{
        private static _ins:SlotCollect;
        private _bet:number;
        private _collectState:COLLECTCODE;
        public static get Ins():SlotCollect {
            if (this._ins == null) this._ins = new SlotCollect();
            return this._ins;
        }

        private _mode:number = -1;
        private _slot:ui.slots.UI_slots;
        private _animation:game.Animation;
        private _clickAnimation:game.Animation;
        public  _unitId:string;
        public _config:any;
        private _contrl:fairygui.Controller;
        private _unitDone:boolean = false;
        private _btnTishiAni = {};

        public init(slot:ui.slots.UI_slots):void {
            this._slot = slot;
            this.doLogic();
        }

        public doLogic():void{
            //return;
            //this._slot.m_n172.addClickListener(this.onClickReward,this);
            //this._contrl = this._slot.m_n172.getController('c1');
            game.GameEvent.SET_SCROLLER.add(this.setScroller , this);
            game.GameEvent.CHANG_BACK_GROUND.add(this.changBackground , this);
            game.GameEvent.UPDATE_COLLECT.add(this.updateCollect , this);
            game.GameEvent.UPDATE_PARTY.add(this.updateParty , this);
            game.UIEvent.SLOT.add(this.onSlot, this);

            this.updateCollect();
            this.updateParty(model.UserModel.Ins.roundOfS);

            if(model.UserModel.Ins.numOfGetReward == 4){
                this.changBackground(1);
            }else {
                this.changBackground(0);
            }


            //this._config = model.LocalConfigModel.Ins.getCollectDataById(model.UserModel.Ins.cakeTaskId);
            //this._unitId = this._config.unit;
            //this.updateCollect(model.UserModel.Ins.roundOfCake,
            //    model.UserModel.Ins.numOfCake);
            //this.collectSuccess();
        }

        public registerClickListener(unit:string, register:boolean):void{
            var n192 = this._slot.m_n192;
            var c1 = n192.m_n193;
            var c2 = n192.m_n192;
            var c3 = n192.m_n194;
            var c4 = n192.m_n195;

            if(unit == 'unit009'){
                if(register){
                    c1.addClickListener(this.onClickReward1,this);
                }else {
                    c1.removeClickListener(this.onClickReward1,this);
                }
            }else if(unit == 'unit010'){
                if(register){
                    c2.addClickListener(this.onClickReward2,this);
                }else {
                    c2.removeClickListener(this.onClickReward2,this);
                }
            }else if(unit == 'unit011'){
                if(register){
                    c3.addClickListener(this.onClickReward3,this);
                }else {
                    c3.removeClickListener(this.onClickReward3,this);
                }
            }else if(unit == 'unit012'){
                if(register){
                    c4.addClickListener(this.onClickReward4,this);
                }else {
                    c4.removeClickListener(this.onClickReward4,this);
                }
            }

        }

        public setScroller(mode:number, time:number):void{
            if(time == 0){
                game.UIEvent.SLOT_CHANGE_SCROLLER.dispatch(mode);
                game.GameEvent.CHANG_BACK_GROUND.dispatch(mode);

                game.GameEvent.SHOW_CHANGE_SCROLLER_END.dispatch();
                return;
            }

            var timeout = setTimeout(function() {
                game.UIEvent.SLOT_CHANGE_SCROLLER.dispatch(mode);
                game.GameEvent.CHANG_BACK_GROUND.dispatch(mode);

                game.GameEvent.SHOW_CHANGE_SCROLLER_END.dispatch();
            }, time*1000);
        }

        public changBackground(mode:number):void{
            var n192 = this._slot.m_n192;
            if(this._mode == mode) return;
            if(mode == 0){//泳池
                n192.getController('c1').selectedIndex = 0;


            }else if(mode == 1){//party
                n192.getController('c1').selectedIndex = 1;

            }
            this._mode = mode;
        }

        public updateParty(round:number):void{
            var n192 = this._slot.m_n192;
            var round = model.LocalConfigModel.Ins.slotsgamecontent('partyturn') - round;
            n192.m_n203.text = '' + round;

        }

        private onSlot(): void {
            this.updateParty(model.UserModel.Ins.roundOfS+1);
        }

        public updateCollect():void{
            var n192 = this._slot.m_n192;
            var unit = model.UserModel.Ins.numOfEachBeauty;
            var alldata = model.LocalConfigModel.Ins.getTaskAllUnit();

            for(var i=0; i<alldata.length;i++){
                var data = alldata[i];
                var num = unit[data['unit']] ;
                var maxnum = data['unitPoint'];

                var text;
                var controller;
                var button;
                if(data['unit'] == 'unit009'){
                    button = n192.m_n193;
                    text = n192.m_n193.m_n193;
                    controller = n192.m_n193.asCom.getController('c1');
                }else if(data['unit'] == 'unit010'){
                    button = n192.m_n192;
                    text = n192.m_n192.m_n195;
                    controller = n192.m_n192.asCom.getController('c1');
                }else if(data['unit'] == 'unit011'){
                    button = n192.m_n194;
                    text = n192.m_n194.m_n196;
                    controller = n192.m_n194.asCom.getController('c1');
                }else if(data['unit'] == 'unit012'){
                    button = n192.m_n195;
                    text = n192.m_n195.m_n194;
                    controller = n192.m_n195.asCom.getController('c1');
                }

                var per = this.changeToPercent(num/maxnum, true);
                text.text = '' + per;
                if(num < maxnum){
                    this._unitDone = false;
                    controller.selectedIndex = 0;
                    this.registerClickListener(data['unit'], false);
                    this.setTishiVisible(data['unit'], false);
                }else if(num == maxnum){
                    controller.selectedIndex = 0;
                    this.registerClickListener(data['unit'], true);
                    this.setTishiVisible(data['unit'], true);
                }else if(num > maxnum){//用收集数量大于要求的数量来标记已经领取了奖励.
                    controller.selectedIndex = 1;
                    this.registerClickListener(data['unit'], false);
                    this.setTishiVisible(data['unit'], false);
                }

            }

            if(this._unitDone == false){
                this._unitDone = this.isCollectDone();
                if(this._unitDone)
                    game.UIEvent.SLOT_STOP_AUTO.dispatch();
            }else {

            }

        }

        public isCollectDone():boolean{
            var unit = model.UserModel.Ins.numOfEachBeauty;
            var alldata = model.LocalConfigModel.Ins.getTaskAllUnit();

            for(var i=0; i<alldata.length;i++) {
                var data = alldata[i];
                var num = unit[data['unit']];
                var maxnum = data['unitPoint'];
                if(num < maxnum)
                    return false;
            }
            return true;
        }

        public changeToPercent(num:number, integer:boolean = false):string{
            //if(!/\d+\.?\d+/.test(num)){
            //    alert("必须为数字");
            //}
            var result = (num * 100).toString(),
                index = result.indexOf(".");
            if(integer){
                if(index == -1 ){
                    return result + "%";
                }
                return result.substr(0, index) + "%";
            }else {
                if(index == -1 || result.substr(index+1).length <= 2){
                    return result + "%";
                }
                return result.substr(0, index + 3) + "%";
            }

        }

        public onClickReward1():void{
            if (SlotBtn.Ins.running) return;
            this.playTouchAni('unit009');
            this.onClickReward('unit009');
        }
        public onClickReward2():void{
            if (SlotBtn.Ins.running) return;
            this.playTouchAni('unit010');
            this.onClickReward('unit010');
        }
        public onClickReward3():void{
            if (SlotBtn.Ins.running) return;
            this.playTouchAni('unit011');
            this.onClickReward('unit011');
        }
        public onClickReward4():void{
            if (SlotBtn.Ins.running) return;
            this.playTouchAni('unit012');
            this.onClickReward('unit012');
        }
        public onClickReward(unitId:string):void{
            var self = this;
            var unitId = unitId;
            model.UserModel.Ins.getRewardOfParty(unitId, function(result:any){

                if(result.addFreeTimes){//免费次数
                    model.UserModel.Ins.freeTimes = result.freeTimes?result.freeTimes:0;
                    game.UIEvent.SLOT_COST.dispatch();
                    game.UIEvent.SLOT_FREE_TIMES.dispatch();
                    game.UIEvent.SHOW_FREE_TIMES.dispatch(result.addFreeTimes);

                }
                if(result.addTimesOfRewardRate){//奖励的倍率次数
                    model.UserModel.Ins.taskTimes = result.timesOfRewardRate;
                    model.UserModel.Ins.taskRate = result.rewardRate;
                    game.UIEvent.MULTI_RATE_START.dispatch();
                }


                model.UserModel.Ins.numOfEachBeauty[unitId] = result[unitId];

                if(result.numOfGetReward == 4){
                    //完成收集美女任务的领取奖励的个数
                    game.GameEvent.CHANG_BACK_GROUND.dispatch(1);
                    game.UIEvent.SLOT_CHANGE_SCROLLER.dispatch(1);

                }else {
                    game.GameEvent.CHANG_BACK_GROUND.dispatch(0);
                }

                if(result.haveParty){
                    //开party的次数


                }

                game.GameEvent.UPDATE_COLLECT.dispatch();
                game.GameEvent.UPDATE_PARTY.dispatch(model.UserModel.Ins.roundOfS);
                game.GameEvent.UPDATE_UNIT.dispatch(unitId);

            },this.callbackFail, this);


        }

        public playTouchAni(unitId:string):void{
            var graph;
            var n192 = this._slot.m_n192;
            if(unitId == 'unit009'){
                graph = n192.m_n193.m_dianjitexiao;
            }else if(unitId == 'unit010'){
                graph = n192.m_n192.m_dianjitexiao;
            }else if(unitId == 'unit011'){
                graph = n192.m_n194.m_dianjitexiao;
            }else if(unitId == 'unit012'){
                graph = n192.m_n195.m_dianjitexiao;
            }

            game.AssetManager.Ins.loadAssets(["laohujinew001_json","laohujinew001_swf_json"],function(data){
                var animation:game.Animation =
                    game.Animation.get("laohujinew001","mc_laohujinew001yc_dianjitubiao")
                        .attach(graph)
                        //.fitScale()
                        .onStop(true, function ():void {

                        })
                        .play(false);

            },this)
        }

        public setTishiVisible(unitId:string, visible:boolean):void{
            var graph;
            var n192 = this._slot.m_n192;
            if(unitId == 'unit009'){
                graph = n192.m_n193.m_tishi;
            }else if(unitId == 'unit010'){
                graph = n192.m_n192.m_tishi;
            }else if(unitId == 'unit011'){
                graph = n192.m_n194.m_tishi;
            }else if(unitId == 'unit012'){
                graph = n192.m_n195.m_tishi;
            }

            var self = this;
            var ani = this._btnTishiAni[unitId];
            if(ani){

            }else {
                game.AssetManager.Ins.loadAssets(["laohujinew001_json","laohujinew001_swf_json"],function(data){

                    ani = game.Animation.get("laohujinew001","mc_laohujinew001yc_tishi")
                            .attach(graph)
                            //.fitScale()
                            .onStop(false, function ():void {

                            })
                            .play(true);

                    self._btnTishiAni[unitId] = ani;
                },this)
            }

            graph.visible = visible;

        }


        public callbackSuccess(result:any):void{

        }
        public callbackFail(result:any):void{
            console.log('------callbackFail-----');
            console.log(result);
        }

        public stopAnimation():void{
            if(this._animation){
                this._animation.stop();
            }
            if(this._clickAnimation){
                this._clickAnimation.stop();
            }
        }


        public getCollectState():any{
            return this._collectState;
        }
    }
}