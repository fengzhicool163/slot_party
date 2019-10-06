/**
 * Created by lixiaodong on 16/12/22.
 */
var async = require('async');
var ioredis = require('ioredis');

var util = require('./util.js');
var gameConfig = util.gameConfig;
var redislock = require('redislock');
var redisClient;

function createRedisClient(){
    if(gameConfig.redis.cluster_mode){
        redisClient = new ioredis.Cluster(gameConfig.redis.cluster);
        console.log('use redis with cluster');
    } else {
        redisClient = new ioredis(gameConfig.redis.single);
        console.log('use redis with single point');
    }

    redisClient.on('connect',function(){
        console.log("REDIS CONNECTED");
    });
    redisClient.on('ready',function(){
        console.log("REDIS READY");
    });
    redisClient.on('error',function(err){
        console.log("REDIS CONNECTION error "+ err);
        console.log('node error', err.lastNodeError);
    });
    redisClient.on('close',function(){
        console.log("REDIS CONNECTION CLOSE");
    });
    redisClient.on('reconnecting',function(){
        console.log("REDIS RECONNECTING");
    });
    redisClient.on('end',function(){
        console.log("REDIS CONNECTION END");
    });

    redislock.setDefaults({
        timeout: 10000,
        retries: 3,
        delay: 50
    });
}

createRedisClient();

exports.getRedisClient = function() {
    return redisClient;
}

exports.setRedisData = function (key,value,callback){
    redisClient.set(key,JSON.stringify(value), function (err) {
        callback(err);
    });
}

exports.setRedisDataOfDays = function (key,value,days,callback){
    redisClient.set(key,JSON.stringify(value), function () {
        redisClient.expire(key, days * 24 * 60 * 60 * 1000, callback);
    });
}

/**
 *
 * @param key
 * @param value
 * @param seconds 过期时间 秒
 * @param callback
 */
exports.setRedisDataOfSeconds = function (key,seconds,value,callback){
    redisClient.setex(key,seconds,JSON.stringify(value), function(err) {
        callback(err);
    });
};

exports.getRedisData = function (key,callback){
    var redisData;

    redisClient.get(key,function(err,data){
        if(!err && !!data){
            redisData = JSON.parse(data);
        }
        callback(err,redisData);
    });
}

exports.deleteRedisData = function (key,callback){
    redisClient.del(key, callback);
}

//获取redis中所有玩家的uid
exports.getRedisKeys = function (key,cb){
    redisClient.keys(key, function (err,keys) {
        cb(err,keys);
    });
}

exports.DECRBY = function (key,value,callback) {
    redisClient.decrby(key,value,callback);
}

exports.INCRBY = function (key,value,callback) {
    redisClient.incrby(key,parseInt(value),callback);
}


//zadd range
//增加用户排名数据
exports.redisZAdd = function(key,score,uid,callback){
    redisClient.zadd(key,score,uid, callback);
}

exports.redisZIncrBy = function (key,field,value,callback) {
    redisClient.zincrby(key,value,field,callback);
}

exports.redisZAddSets = function(sets,callback){
    redisClient.zadd(sets, function (err, response) {
        callback(err,response);
    });
}

//根据score 范围 获取用户ID score从小到大排序
exports.redisZRANGEBYSCORE = function(key,min,max,cb){
    redisClient.zrangebyscore(key,min,max, function (err,data) {
        cb(err,data);
    });
}

//获取排行榜所有用户ID 正序 需要reverse
exports.redisZRANGEBYSCOREALL = function(key,cb){
    redisClient.zrangebyscore(key,'-inf','+inf', function (err,data) {
        cb(err,data);
    });
}

/**
 * 获取排行和排行score
 * @param key
 * @param number 返回前number名 特殊情况 0 返回所有
 * @param cb
 */
exports.redisZRANGEWITHSCORES = function(key,number,cb){
    redisClient.zrange(key,0,-1,'WITHSCORES',function (err,data) {
        var array = [];
        if(!err && !!data && data.length){
            data = data.reverse();

            if(number != 0){
                data = data.splice(0,number * 2);
            }

            for(var i = 0 ,j = 1; i < data.length; i += 2, j++){
                array.push({
                    id  :   data[i + 1],
                    value   :   parseInt(data[i]),
                    ranking :   j
                });
            }
        }
        cb(err,array);
    });
}

/**
 * 根据uid 获取score
 * @param key
 * @param uid
 * @param cb
 */
exports.redisZSCORE = function(key,uid,cb){
    redisClient.zscore(key,uid, function (err,data) {
        cb(err,data);
    });
}

function redisZCard (key,callback){
    redisClient.zcard(key, function (err,data) {
        callback(err,data);
    });
}

exports.redisZCard = redisZCard;

exports.redisZRank = function(key,field,callback){
    var ranking = -1;
    var length = 0;


    async.waterfall([
        function(cb){
            redisZCard(key,function(err,data){
                if(!err && !!data){
                    length = data;
                }
                cb(err);
            });
        },
        function(cb){
            if(length > 0){
                redisClient.zrank(key,field,function(err,data){
                    if(!err && !!data){
                        ranking = length - data;
                    }
                    cb(err);
                });
            } else {
                cb();
            }
        }
    ],function(err){
        callback(err,ranking);
    });
}

//获取redis中所有玩家的uid
exports.getRedisKeys = function(key,cb){
    redisClient.keys(key, function (err,keys) {
        cb(err,keys);
    });
}

exports.redisMget = function(keys,cb){
    redisClient.mget(keys, function (err,data) {
        if(!err && !!data){
            data = JSON.parse(data);
        }
        cb(err,data);
    });
}

exports.redisMset = function(sets,callback){
    redisClient.mset(sets,callback);
}

exports.redisHset = function(key,field,value,callback){
    redisClient.hset(key,field,JSON.stringify(value),callback);
}

exports.redisHDel = function (key,field,callback) {
    redisClient.hdel(key,field,callback);
}

//array reply
exports.redisHMGet = function(key,fields,callback){
    redisClient.hmget(key,fields, function (err,data) {
        var array = [];
        if(!err && !!data && data.length){
            for(var i = 0 ; i < data.length; i++){
                array.push(JSON.parse(data[i]));
            }
        }
        callback(err,array);
    });
}

exports.redisHIncrBy = function(key,field,value,callback){
    redisClient.hincrby(key,field,value,callback);
}

exports.redisHKeys = function(key,callback){
    redisClient.hkeys(key,callback);
}

exports.redisHMset = function(sets,callback){
    redisClient.hmset(sets,callback);
}

exports.redisHGet = function(key,field,callback){
    redisClient.hget(key,field, function (err,data) {
        if(!err && !!data){
            data = JSON.parse(data);
        }
        callback(err,data);
    });
}


// object reply
exports.redisHGetAll = function (key, callback) {
    redisClient.hgetall(key, function (err, data) {
        if(!err && !!data){
            for(var key in data){
                data[key] = JSON.parse(data[key]);
            }
        }
        callback(err,data);
    });
}

exports.redisHLen = function (key, callback) {
    redisClient.hlen(key, function (err,data) {
        callback(err,data);
    });
}

//list lpush
exports.redisLPush = function (key, value, callback) {
    redisClient.lpush(key, JSON.stringify(value), callback);
}

exports.redisRPop = function (key,callback) {
    redisClient.rpop(key,callback);
}

exports.redisLRange = function (key, max, callback) {
    redisClient.lrange(key, 0, max, function (err, data) {
        if (!err && !!data && data.length) {
            for(var i = 0 ; i < data.length; i++){
                data[i] = JSON.parse(data[i]);
            }
        }
        callback(err,data);
    });
}

exports.redisLLen = function (key,callback) {
    redisClient.llen(key,callback);
}

exports.lockPlayer = function(key, callback){
    var playerlock = redislock.createLock(redisClient);
    playerlock.acquire(key+":lock", function (err) {
        callback(err,playerlock);
    });
}

exports.releasePlayerLock = function(playerlock,callback){
    playerlock.release(function (err) {
        callback(err);
    });
}

exports.redisExists = function (key,callback) {
    redisClient.exists(key,callback);
}

//事务操作
exports.redisMulti = function (tasks, callback) {
    redisClient.multi(tasks).exec(callback);
}