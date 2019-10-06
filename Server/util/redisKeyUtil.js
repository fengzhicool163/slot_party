/**
 * Created by lixiaodong on 16/12/22.
 */
var _ = require('underscore');
var util = require('./util.js');
var configUtil = require('./configUtil');
var gameConfig = util.gameConfig;
var redisPrefix = gameConfig.redis.prefix;
var lobbyPrefix = gameConfig.redis.lobbyPrefix;
/**
 *
 * @type {{
 * }}
 * MAX_REWARD_RANK 鸿运榜 单次最大奖券收益排行
 * JACK_POT 抽奖奖池
 * REWARD_POT 收益奖池
 * REWARD_LEVEL 不同获奖等级的数量
 * TOTAL_COST    所有用户总花费
 * TOTAL_REWARD  所有用户总收益
 * WINNING_RECORD 中奖记录
 * AUTO_FILL_TIMES 自动补充奖池次数
 * AUTO_FILL_DIAMOND 自动补充奖池U钻总值
 * HAVE_PARTY_TIMES  开party的次数
 */
var keys = {
    SLOT_RANKING    :   'SLOT_RANKING',
    MAX_REWARD_RANK :   'MAX_REWARD_RANK',
    NOTICE_KEY      :   'NOTICE',
    SLOT_PLAYER     :   'SLOT_PLAYER',
    JACK_POT        :   'JACK_POT',
    REWARD_POT      :   'REWARD_POT',
    POINT002_DIAMOND:   'POINT002_DIAMOND',
    REWARD_LEVEL    :   'REWARD_LEVEL',
    TOTAL_COST      :   'TOTAL_COST',
    TOTAL_REWARD    :   'TOTAL_REWARD',
    WINNING_RECORD  :   'WINNING_RECORD',
    HAVE_PARTY_TIMES  :   'HAVE_PARTY_TIMES'
};

function getKey(name){
    return redisPrefix + keys[name];
}

function getLobbyKey(name){
    return lobbyPrefix + keys[name];
}

exports.getLobbyKey = getLobbyKey;
exports.getKey = getKey;
