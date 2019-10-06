/**
 * 排行工具模块
 * Created by lixiaodong on 16/12/22.
 */
var _ = require('underscore');
var redisUtil = require('../util/redisUtil');

var Ranking = function (opt) {
    this.rankKey = opt.rankKey;
    this.timer = null;
}

var p = Ranking.prototype;

/**
 * 替换排名数值
 * @param field
 * @param value
 * @param next
 */
p.updateRanking = function (field, value, next) {
    redisUtil.redisZAdd(this.rankKey, value, field, next);
}

/**
 * 增加排名数值
 * @param field
 * @param value
 * @param next
 */
p.incrByRanking = function (field, value, next) {
    redisUtil.redisZIncrBy(this.rankKey, field, value, next);
}

/**
 * 获取score在min -> max之间的排行榜
 * array return [uid,,,,,]
 * @param min
 * @param max
 * @param next
 */
p.getRankingByRange = function (min, max, next) {
    redisUtil.redisZRANGEBYSCORE(this.rankKey, min, max, next);
}

/**
 * 根据用户ID 获取排行 score
 * @param field
 * @param next
 */
p.getRankScoreByUid = function (field, next) {
    redisUtil.redisZSCORE(this.rankKey, field, next);
}

/**
 * 获取排名field & value
 * array return [{id, ranking, value},,]
 * @param min
 * @param max
 * @param next
 */
p.getRankingWithScoreByRange = function (number, next) {
    redisUtil.redisZRANGEWITHSCORES(this.rankKey, number, next);
}

/**
 * 获取用户的排名
 * @param field 玩家ID
 * @param next
 */
p.getRankByUid = function (field, next) {
    redisUtil.redisZRank(this.rankKey, field, next);
}

/**
 * 根据用户ID获取 score
 * @param field
 * @param next
 */
p.getScoreByUid = function (field, next) {
    redisUtil.redisZSCORE(this.rankKey, field, next);
}


/**
 * 结算排行榜
 * @param settleFunc 结算函数
 * @param nextTime 结束时间戳
 */
p.settlement = function (settleFunc,nextTime) {
    var time = nextTime - Date.now();
    console.log('距离结算还有',time / (60 * 60 * 1000),'小时');
    setTimeout(settleFunc, time);
}

p.getRankingLength = function (next) {
    redisUtil.redisZCard(this.rankKey,next);
}

module.exports = Ranking;