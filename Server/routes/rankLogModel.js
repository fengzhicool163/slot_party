/**
 * Created by lixiaodong on 16/12/27.
 */
var schema = require('../schema/rank');

/**
 * 排行榜数据落地
 * @param rankLogArray
 * @param next
 */
function addRankLog(rankLogArray,next) {

    var info = new schema({
        rank        :   rankLogArray,
        createTime  :   Date.now()
    });

    info.save(function (err) {
        next(err);
    });
}

//获取最终
function getRankLog(next) {
    var rank = [];
    schema.findOne().exec(function (err,data) {
        if(!err && !!data){
            rank = data.rank;
        }
        next(err,rank);
    });
}

exports.addRankLog = addRankLog;
exports.getRankLog = getRankLog;