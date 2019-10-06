/**
 * Created by zhaikaiyu on 16/12/22.
 */
module model {

    export interface UserProfile {
        uid:string;
        userToken:string;
        username:string;
        upliveCode:string;
        avatar:string;
        gender:number;
        grade:number;
        diamond:number;
    }

    export class UserModel {
        private static _ins:UserModel;
        public static get Ins():UserModel {
            if (!this._ins) this._ins = new model.UserModel();
            return this._ins;
        }

        public userId:string;
        public userProfile:UserProfile;

        public point001:number = 0;
        public point002:number = 0;
        public freeTimes: number = 0;
        public lastTaskCount: number = 0;
        public lastTaskStatus: boolean = false;
        public taskCount: number = 0;
        public taskStatus: boolean = false;
        public records = [];
        public autoFill:boolean = false;
        public jackPotDiamond:number = 0;
        public activityEndTime:number = 0;
        public oldJackPotDiamond:number = 0;
        public isClosed:boolean = false;
        //public roundOfCake:number ; // 剩余回合数量
        //public numOfCake:number; //已经收集到蛋糕的个数
        //public whichCake:string ; // 收集哪个蛋糕
        //public maxNumOfCake:number; // 收集总数量
        //public cakeTaskId:string ;
        public taskRate: number = 0;
        public taskTimes: number = 0;

        public collectBeautys:number;//本次收集的
        public numOfBeautys:number;//完成收集美女任务的个数
        public numOfEachBeauty:any;//{'unit009': 10,...} (每种美女已收集个数)
        public oldNumOfEachBeauty:any;//{'unit009': 10,...} (每种美女已收集个数)
        public roundOfS:number;//S界面的回合数
        public haveParty:number;//party的次数
        public numOfGetReward:number;//开奖次数



        public getIsClosed():boolean{
            var endtime = model.UserModel.Ins.activityEndTime - model.GeneralServerRequest.getServerTime();
            this.isClosed = (endtime <=0)? true:false;
            return this.isClosed;
        }

        public reqLogin(callback?:Function, context?:any):void {
            // 本地调试
            if (PPGame.isLocalhost) {
                PPGame.urlParams['userId'] = '5010499';
            }

            var params:any = {
                uid: PPGame.urlParams['userId']
            };

            var self = this;
            GeneralServerRequest.req('login', params, {
                context: this,
                onSuccess: function(result:any):void {
                    // 初始化自己的数据
                    self.userProfile = result.user;
                    self.userId = self.userProfile.uid;
                    self.point001 = result.user.point001 ? result.user.point001 : 0;
                    self.point002 = result.user.point002 ? result.user.point002 : 0;
                    self.freeTimes = result.user.freeTimes || 0;

                    self.lastTaskCount = self.taskCount;
                    self.lastTaskStatus = self.taskStatus;

                    self.taskCount = result.user.taskCount || 0;
                    self.taskStatus = result.user.taskStatus || false;

                    self.records = result.records || [];
                    self.activityEndTime = result.activityEndTime || 0;

                    self.taskTimes = result.user.timesOfRewardRate;
                    self.taskRate = result.user.rewardRate;

                    self.numOfBeautys = result.user.numOfBeautys  || 0;//完成收集美女任务的个数
                    self.numOfEachBeauty = result.user.numOfEachBeauty || {};//{'unit009': 10,...} (每种美女已收集个数)
                    self.oldNumOfEachBeauty = self.numOfEachBeauty;
                    self.roundOfS = result.user.roundOfS || 0;//S界面的回合数
                    self.haveParty = result.user.haveParty || 0; //party的次数
                    self.numOfGetReward = result.user.numOfGetReward || 0;

                    //if (result.activityEndTime > 0) {
                    self.getIsClosed();
                    //}

                    game.UIEvent.UPDATE_JACKPOT_LIST.dispatch(0);
                    game.GameEvent.UPDATE_HUD_DIAMOND.dispatch();
                    game.GameEvent.UPDATE_QUEST_REDDOT.dispatch();

                    if (callback) callback.apply(context);
                },
                onFail: function(result:any, errorCode:number):void {
                    var failCallback = function () {
                        model.ErrorAction.retry();
                    };
                    ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION, {
                        content: game.Tools.lang('登錄失敗，點擊確定按鈕重試'),
                        confirmCallback: failCallback,
                        confirmCallbackObj: self,
                        cancelCallback: failCallback,
                        cancelCallbackObj: self
                    });
                }
            });
        }

        public getSlotElement(line:number, diamond:number, callback?:Function, failCallBack?:Function,context?:any):void {
            var self = this;
            GeneralServerRequest.req('getSlotElement', {line:line, diamond:diamond}, {
                context: this,
                onSuccess: function (result: any): void {
                    // 先记录之前的状态
                    self.lastTaskCount = self.taskCount;
                    self.lastTaskStatus = self.taskStatus;
                    // 再更新状态
                    self.taskStatus = result.taskStatus;
                    self.taskCount = result.taskCount;
                    // 派发事件进行更新
                    game.GameEvent.UPDATE_QUEST_REDDOT.dispatch();
                    if (callback) callback.apply(context, [result]);
                },
                onFail: function(result:any, errorCode:number):void {
                    if (failCallBack) failCallBack.apply(context, [result]);
                }
            });
        }

        public isEnough(num:number, type:string, callback:Function=null, context:any=null, isclear:boolean=true):boolean {
            var desc = {
                "diamond": game.Tools.lang("您的U鑽不足\n是否去購買？"),
            };

            var result = this.userProfile[type] || 0;
            if (result < num) {
                var p = ui.UILayer.Ins.popup(ui.PopUpIds.NOTIFICATION, {
                    content: desc[type],
                    showCancel: true,
                    confirmCallback: function () {
                        if (isclear) {
                            ui.UILayer.Ins.clearAllPopUp();
                        }

                        if (type == 'diamond') {
                            WindowMsg.Ins.posMessage({ key: 'pay' });
                        }
                    },
                });
                p.forceBackground(true);
            } else {
                return true;
            }
            return false;
        }

        public deliveryDiamond(callback?:Function, context?:any):void {
            var self = this;
            GeneralServerRequest.req('deliveryDiamond', {}, {
                context: this,
                onSuccess: function(result:any):void {
                    var resultDiamond = (parseInt(result && result.diamond) || 0);
                    PPGame.Ins.trackEvent(PPTrackEvent.PAY, PPPayStep.SUCESS_PAY,{"price" : (resultDiamond - self.userProfile.diamond)});
                    self.userProfile.diamond = resultDiamond;

                    game.GameEvent.UPDATE_HUD_DIAMOND.dispatch();

                    if (callback) callback.apply(context);
                },
                onFail: function(result:any, errorCode:number):void {
                    // Nothing to do..
                }
            });
        }

        /*
         *消费返利查询
         */
        public convertFreeTimes(callback?:Function, context?:any):void {
            var params:any = {};
            GeneralServerRequest.req('convertFreeTimes', null, {
                context: this,
                onSuccess: function(result:any):void {
                    console.log('----->convertFreeTimes  fail');
                    if (callback) callback.apply(context,[result]);
                },
                onFail: function(result:any, errorCode:number):void {
                    // Nothing to do..
                    console.log('----->convertFreeTimes  fail');
                }
            });
        }
        /*
         *消费返利领取
         */
        public getFreshUpCostDiamond(callback?:Function, context?:any):void {
            var params:any = {};
            GeneralServerRequest.req('getFreshUpCostDiamond', null, {
                context: this,
                onSuccess: function(result:any):void {
                    if (callback) callback.apply(context,[result]);
                },
                onFail: function(result:any, errorCode:number):void {
                    // Nothing to do..
                }
            });
        }

        /*
         * type = 1 总收益排行
         * type = 2 单次最大收益排行
         */
        public getRanking(type:number , callback?:Function, context?:any):void {
            var params:any = {};
            params.type = type;
            GeneralServerRequest.req('getRanking', params, {
                context: this,
                onSuccess: function(result:any):void {
                    if (callback) callback.apply(context,[result]);
                },
                onFail: function(result:any, errorCode:number):void {
                    // Nothing to do..
                }
            });
        }

        public getNotice(callback?:Function, context?:any):void {
            GeneralServerRequest.req('getNotice', {}, {
                context: this,
                onSuccess: function(result:any):void {
                    if (callback) callback.apply(context,[result]);
                },
                onFail: function(result:any, errorCode:number):void {
                    // Nothing to do..
                }
            },PPGame.ENV.LOBBY_URL);
        }

        public getPoint001():number {
            return this.point001 || 0;
        }
        public getPoint002():number {
            return this.point002 || 0;
        }

        public getRecords():any {
            return this.records || [];
        }

        public getAwardByType(type:number , callback?:Function ,failback?:Function, context?:any):void{
            var params:any = {};
            params.type = type;
            var self = this;
            GeneralServerRequest.req('getAwardByType', params, {
                context: this,
                onSuccess: function(result:any):void {
                    self.point001 = result.point001;
                    self.point002 = result.point002;
                    self.freeTimes = result.freeTimes;
                    self.userProfile.diamond = (result && result.diamond) || 0;
                    game.GameEvent.UPDATE_HUD_DIAMOND.dispatch();
                    if (callback) callback.apply(context, [result]);
                },
                onFail: function(result:any, errorCode:number):void {
                    if (failback) failback.apply(context, [result]);
                }
            });
        }


        public getTaskCount():number{
            return this.taskCount;
        }


        public getQueryJackPot(callback?:Function, failCallBack?:Function,context?:any):void {
            var isHideLoading = true;
            var self = this;
            GeneralServerRequest.req('queryJackPot', null, {
                context: this,
                onSuccess: function(result:any):void {
                    if (callback) callback.apply(context, [result]);
                },
                onFail: function(result:any, errorCode:number):void {
                    if (failCallBack) failCallBack.apply(context, [result]);
                }
            }, null, isHideLoading);
        }

        /*
         getReward 获取奖励接口
         接收参数：
         {id:用户id}
         返回：
         {
         freeTimes:奖励的免费次数，
         rewardRate：奖励的倍率倍数
         timesOfRewardRate：奖励的倍率次数
         numOfBeautys： 2 完成收集美女任务的个数
         }
         */
        public getRewardOfParty(type:string , callback?:Function, failCallBack?:Function, context?:any):void {
            var params:any = {};
            params.unitId = type;
            GeneralServerRequest.req('getRewardOfParty', params, {
                context: this,
                onSuccess: function(result:any):void {
                    if (callback) callback.apply(context,[result]);

                },
                onFail: function(result:any, errorCode:number):void {
                    // Nothing to do..
                    if (failCallBack) failCallBack.apply(context, [result]);

                }
            });
        }

    }
}