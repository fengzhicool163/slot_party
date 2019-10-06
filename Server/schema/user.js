/**
 * Created by lixiaodong on 16/12/22.
 */
var mongoose = require('mongoose');
var util = require('../util/util.js');
var configUtil = require('../util/configUtil');

/**
 * diamond 用户现有u钻
 * costDiamond 当前时间段花费u钻
 * totalCostDiamond 从始至终总的花费u钻
 * awardDiamond 当前时间段收获u钻
 * totalAwardDiamond 从始至终总的收获u钻
 * totalSlotTimes 总次数
 * illegalTimes 每次抽奖 >= 500的次数 每天重置
 * dayAwardDiamond 每天收益U钻
 * dayCostDiamond 每天花费U钻
 * slotTimes 每天抽奖次数
 * awardTimes 每天收益次数
 * getNoticeTime 获取公告的时间
 * chest
 * minigame001 24小时以内领取minigame001奖励达到10次
 * minigame002 24小时以内领取minigame002奖励达到5次
 * convertTimes 兑换免费次数的次数
 * point001 钥匙； point002 烟花
 *
 * numOfBeautys:  已收集几种美女
 * numOfEachBeauty : {'unit009': 10,...} (每种美女已收集个数)
 * roundOfS： S界面的回合数
 * numOfGetReward :领取奖励的次数
 * haveParty : party的次数
 *
 */
var userSchema = new mongoose.Schema({
    uid         :   String,
    userToken   :   String,
    username    :   String,
    upliveCode  :   String,
    gender      :   Number,
    grade       :   Number,
    avatar      :   String,
    diamond     :   Number,
    costDiamond :   Number,
    totalCostDiamond    :   Number,
    awardDiamond:   Number,
    totalAwardDiamond   :   Number,
    dayCostDiamond: Number,
    dayAwardDiamond:    Number,
    slotTime    :   Number,
    totalSlotTimes  :   Number,
    slotTimes   :   Number,
    awardTimes  :   Number,
    illegalTimes    :   Number,
    loginTime   :   Number,
    resetTime   :   Number,
    getNoticeTime   :   Number,
    freeTimes   :   Number,
    singleMaxReward :   Number,
    minigame001 :    Number,
    minigame002 :    Number,
    convertTimes    :   Number,
    convertTime :   Number,
    taskStatus  :   Boolean,
    taskCount   :   Number,
    createTime  :   Number,
    dayRecord:  mongoose.Schema.Types.Mixed,
    allRecord:  mongoose.Schema.Types.Mixed,

    numOfBeautys  :   Number,
    numOfEachBeauty    : mongoose.Schema.Types.Mixed,
    numOfGetReward  : Number,
    rewardRate  :   Number,
    timesOfRewardRate :   Number,
    roundOfS    :   Number,
    haveParty   :   Number
});


userSchema.pre('save',function (next) {
    var self = this;

    self.upliveCode = self.upliveCode || '';
    self.userToken = self.userToken || '';
    self.diamond = self.diamond || 0;
    self.freeTimes = self.freeTimes || 0;
    self.costDiamond = self.costDiamond || 0;
    self.awardDiamond = self.awardDiamond || 0;
    self.totalCostDiamond = self.totalCostDiamond || 0;
    self.totalAwardDiamond = self.totalAwardDiamond || 0;
    self.slotTimes = self.slotTimes || 0;
    self.totalSlotTimes = self.totalSlotTimes || 0;
    self.awardTimes = self.awardTimes || 0;
    self.illegalTimes = self.illegalTimes || 0;
    self.createTime = self.createTime || Date.now();
    self.resetTime = self.resetTime || 0;
    self.getNoticeTime = self.getNoticeTime || Date.now();
    self.singleMaxReward = self.singleMaxReward || 0;
    self.minigame001 = self.minigame001 || 0;
    self.minigame002 = self.minigame002 || 0;
    self.convertTimes = self.convertTimes || 0;
    self.convertTime = self.convertTime || 0;
    self.taskStatus = self.taskStatus || false;
    self.taskCount = self.taskCount || 0;
    self.dayCostDiamond = self.dayCostDiamond || 0;
    self.dayAwardDiamond = self.dayAwardDiamond || 0;
    self.dayRecord = self.dayRecord || {};
    self.allRecord = self.allRecord || {};

    self.numOfBeautys = self.numOfBeautys || 0;
    self.numOfEachBeauty = self.numOfEachBeauty || {'unit009':0,'unit010':0,'unit011':0,'unit012':0};
    self.numOfGetReward = self.numOfGetReward || 0;
    self.rewardRate = self.rewardRate || 1;
    self.timesOfRewardRate = self.timesOfRewardRate || 0;
    self.roundOfS = self.roundOfS || 0;
    self.haveParty = self.haveParty || 0;


    self.markModified('dayRecord');
    self.markModified('allRecord');
    self.markModified('numOfEachBeauty');

    self.resetInfo();

    next();
});


userSchema.methods.resetInfo = function () {
    var self = this;

    var morning = util.getMNTime().morning;

    if(self.resetTime < morning){
        self.resetTime = Date.now();
        self.illegalTimes = 0;
        self.slotTimes = 0;
        self.awardTimes = 0;
        self.dayAwardDiamond = 0;
        self.dayCostDiamond = 0;
        self.minigame001 = 0;
        self.minigame002 = 0;
        self.dayRecord = {};
    }
};
userSchema.methods.updateCostAndRewardOfuser = function (costDiamond,rewardDiamond) {
    var self = this;
    if(costDiamond){
        self.dayCostDiamond += costDiamond;
        self.costDiamond += costDiamond;
        self.totalCostDiamond += costDiamond;
    }

    if(rewardDiamond){
        self.dayAwardDiamond += rewardDiamond;
        self.awardDiamond += rewardDiamond;
        self.totalAwardDiamond += rewardDiamond;
    }
};

userSchema.methods.resetRewardRate = function () {
    var self = this;
    if(self.timesOfRewardRate > 0){
        self.timesOfRewardRate --;
        if(self.timesOfRewardRate == 0){
            self.rewardRate = 1;
        }
    }
};

userSchema.methods.getRewardEleOfParty = function (slotResult) {
    var self = this;
    if(this.numOfGetReward < 4){
        for(var key in slotResult.collectBeautys){//收集本局有收集的
            var num = configUtil.getObjByOpt('slotsgameminigame',{unit:key}).unitPoint;
            self.numOfEachBeauty[key] = self.numOfEachBeauty[key] || 0;
            if(self.numOfEachBeauty[key] < num){
                self.numOfEachBeauty[key] += slotResult.collectBeautys[key];
                if(self.numOfEachBeauty[key] >= num){
                    self.numOfEachBeauty[key] = num;
                    self.numOfBeautys ++;
                }
            }
        }
    }else {//在S界面
        var slotsgamecontent = configUtil.getConfigByName('slotsgamecontent')[0];
        self.roundOfS ++;
        var roundOfParty = slotsgamecontent.partyturn;
        console.log('roundOfParty-------',roundOfParty);
        if(self.roundOfS >= roundOfParty){
            //s回合结束 回到到R界面
            self.roundOfS = 0;
            self.numOfBeautys = 0;
            self.numOfEachBeauty = {'unit009':0,'unit010':0,'unit011':0,'unit012':0};
            self.numOfGetReward = 0;
        }
    }
};

userSchema.methods.updateDateOfGodForUser = function (line,cost) {
    var self = this;
    self.dayRecord = self.dayRecord || {};
    self.allRecord = self.allRecord || {};
    var temp = ''+line+'*'+cost;
    self.dayRecord[temp] = self.dayRecord[temp] || 0;
    self.dayRecord[temp]++;

    self.allRecord[temp] = self.allRecord[temp] || 0;
    self.allRecord[temp]++;
};


if (!userSchema.options.toObject)
    userSchema.options.toObject = {};

userSchema.options.toObject.transform = function (doc, ret){
    delete ret._id;
    return ret;
}

var userModel = mongoose.model('user',userSchema);

module.exports = userModel;