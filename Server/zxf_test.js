/**
 * Created by xingyunzhi on 17/3/1.
 */
var async = require('async');

var redisUtil = require('./util/redisUtil');
var redisKeyUtil = require('./util/redisKeyUtil');

function a(){
    async.waterfall([
        function (cb) {
            var key = redisKeyUtil.getKey('JACK_POT');
            redisUtil.getRedisData(key, function (err,data) {
                cb();
            });
        },
        function (cb) {
            cb();
        },
        function (cb) {
            cb();
        },
        function (cb) {
            cb();
        }
    ],function (err) {
        return 1;
    });
    return 0;
}

var b = a();

console.log('b: ',b);