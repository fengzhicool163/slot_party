module game {

    export interface SlotResponse {

        diamond: number;
        rewardDiamond: number;
        totalAwardDiamond: number;
        slotResult: game.SlotResponseResult;
        records:any;
        //autoFill:boolean;
        //jackpotDiamond:number;
        //oldJackPotDiamond:number;
        //roundOfCake:number ;// 积攒蛋糕的回合
        //numOfCake:number; //  积攒蛋糕的个数
        timesOfRewardRate:number;
        rewardRate:number;
        numOfBeautys:number;  //完成收集美女任务的个数
        numOfEachBeauty:any;//{'unit009': 10,...} (每种美女已收集个数)
        roundOfS:number;//S界面的回合数
        haveParty:number;//party的次数
        numOfGetReward:number;//开奖次数

    }

    export interface SlotResponseResult {

        point: game.SlotResponseResultPoint;
        rowArray: any;
        rowIndex: number[];
        rewardDetails: any;
        collectBeautys:number;  //是本回合收集的
    }

    export interface SlotResponseResultPoint {

        point001: number;
        point002: number;

    }

    export class SlotLogic {

        private static _ins:SlotLogic;
        public static get Ins():SlotLogic {
            if (this._ins == null) this._ins = new SlotLogic();
            return this._ins;
        }

        // 选了几条线
        public line:number = 1;
        // 选了多大的赌注
        public bet:number = 10;
        // 单次赌注
        public singleBet:number = 0;

        public response:game.SlotResponse;

        public init():void {
            // 点击不同的线
            game.UIEvent.LINE.add(this.onLineChanged, this);
            // 点击不同的赌注
            game.UIEvent.BET.add(this.onBetChanged, this);
            // 开始拉
            game.UIEvent.SLOT.add(this.onSlot, this);

            // 线结束
            game.UIEvent.SLOT_LINE_REWARD_END.add(this.onSlotComplete, this);

            game.UIEvent.SHOW_KEY_ANI_END.add(this.onKeyPlayEnd, this);

            game.UIEvent.SHOW_FIRE_ANI_END.add(this.onFirePlayEnd, this);

            game.GameEvent.SHOW_COLLECT_EFFECT_END.add(this.onCollectEffectEnd, this);

            game.GameEvent.SHOW_CHANGE_SCROLLER_END.add(this.onChangeScrollerEnd, this);

            //game.UIEvent.SHOW_JACKPOT_ANI_END.add(this.onJackpotPlayEnd, this);

            //game.UIEvent.SHOW_SUPPLEMENT_ANI_END.add(this.onSupplementPlayEnd, this);
        }

        private onLineChanged(line:number):void {
            this.line = line;

            this.singleBet = this.bet * this.line;
        }

        private onBetChanged(bet:number):void {
            this.bet = bet;

            this.singleBet = this.bet * this.line;
        }

        private onSlot():void {
            // return;
            // 发请求,等待结果,并发出事件
            // console.log('[SlotLogic]', 'on slot');
            var self = this;
            model.UserModel.Ins.getSlotElement(
                self.line, 
                self.bet, 
                function (result:game.SlotResponse):void {
                    // 有结果啦!
                     //result.rewardDiamond > 0 ?
                         //result.rewardDiamond *= 20 : result.rewardDiamond = 0;

                    if (model.UserModel.Ins.freeTimes > 0)
                        model.UserModel.Ins.freeTimes --;

                    if (result.slotResult.point) {
                        if(result.slotResult.point.point001 > 0){
                            model.UserModel.Ins.point001 += result.slotResult.point.point001;
                        }
                        if(result.slotResult.point.point002 > 0){
                            model.UserModel.Ins.point002 += result.slotResult.point.point002;
                        }
                    }

                    if(model.UserModel.Ins.taskRate > 0){
                        for(var i in result.slotResult.rewardDetails){
                            result.slotResult.rewardDetails[i] *= model.UserModel.Ins.taskRate;
                        }
                    }
                    model.UserModel.Ins.oldNumOfEachBeauty = model.UserModel.Ins.numOfEachBeauty;

                    self.response = result;
                    model.UserModel.Ins.userProfile.diamond = result.diamond;
                    model.UserModel.Ins.collectBeautys = result.slotResult.collectBeautys;  //是本回合收集的
                    model.UserModel.Ins.numOfBeautys = result.numOfBeautys;//完成收集美女任务的个数
                    model.UserModel.Ins.numOfEachBeauty = result.numOfEachBeauty;//{'unit009': 10,...} (每种美女已收集个数)
                    model.UserModel.Ins.haveParty = result.haveParty || 0; //party的次数
                    model.UserModel.Ins.numOfGetReward = result.numOfGetReward || 0;

                    model.UserModel.Ins.taskTimes = result.timesOfRewardRate;
                    model.UserModel.Ins.taskRate = result.rewardRate;


                    //if(model.UserModel.Ins.taskTimes == 0){
                    //    game.UIEvent.MULTI_RATE_STOP.dispatch();
                    //}
                    //game.UIEvent.UPDATA_RATE.dispatch();
                    game.UIEvent.SLOT_FREE_TIMES.dispatch();
                    //game.GameEvent.UPDATE_PARTY.dispatch(model.UserModel.Ins.roundOfS+1);
                    game.UIEvent.SLOT_RESULT.dispatch(null, result);

                    model.UserModel.Ins.roundOfS = result.roundOfS;//S界面的回合数
                }, 
                function (result:any):void {
                    game.GameEvent.UPDATE_PARTY.dispatch(model.UserModel.Ins.roundOfS);
                    game.UIEvent.SLOT_RESULT.dispatch(result, null);
                }, this
            );
        }

        private onSlotComplete():void {
            this._collectEffectPlayEnd = this._changeScrollerEnd = false;
            if(true){//收集动画
                game.GameEvent.COLLECT_EFFECT.dispatch();
            }else {
                this.onCollectEffectEnd();
            }
            game.GameEvent.UPDATE_COLLECT.dispatch();

            if(!this.response.timesOfRewardRate){
                game.GameEvent.MULTI_RATE_STOP.dispatch();
            }

            //game.GameEvent.UPDATE_COLLECT.dispatch(this.response.roundOfCake
            //,this.response.numOfCake);

            //this.checkComplete();

        }

        private _keyPlayEnd:boolean = false;
        private onKeyPlayEnd():void {
            this._keyPlayEnd = true;

            this.checkComplete();
        }

        private _firePlayEnd:boolean = false;
        private onFirePlayEnd():void {
            this._firePlayEnd = true;

            this.checkComplete();
        }

        private _collectEffectPlayEnd:boolean = false;
        private onCollectEffectEnd():void {
            this._collectEffectPlayEnd = true;
            this.checkComplete();

            var self = this;
            //model.LocalConfigModel.Ins.slotsgamecontent('partyturn') - model.UserModel.Ins.roundOfS
            if(model.UserModel.Ins.numOfGetReward < 4){
                var mode = view.SlotWheel.Ins.getMode();
                if(mode != 0){
                    //var timeout = setTimeout(function() {
                    //    game.UIEvent.SLOT_CHANGE_SCROLLER.dispatch(0);
                    //    game.GameEvent.CHANG_BACK_GROUND.dispatch(0);
                    //    self.onChangeScrollerEnd();
                    //}, 1000);
                    game.GameEvent.SET_SCROLLER.dispatch(0,1);
                }else {
                    this.onChangeScrollerEnd();
                }


            }else {
                this.onChangeScrollerEnd();
            }


            if(model.UserModel.Ins.taskTimes == 0){
                game.UIEvent.MULTI_RATE_STOP.dispatch();
            }

        }

        private _changeScrollerEnd:boolean = false;
        private onChangeScrollerEnd():void {
            this._changeScrollerEnd = true;
            this.checkComplete();
        }

        //private _jackpotPlayEnd:boolean = false;
        //private onJackpotPlayEnd():void {
        //    this._jackpotPlayEnd = true;
        //
        //    this.checkComplete();
        //}

        //private _supplementPlayEnd:boolean = false;
        //private onSupplementPlayEnd():void {
        //    this._supplementPlayEnd = true;
        //
        //    this.checkComplete();//
        //}

        private checkComplete():void {
            if (this._collectEffectPlayEnd && this._changeScrollerEnd){
                game.UIEvent.SLOT_COMPLETE.dispatch();
            }

        }

    }

}