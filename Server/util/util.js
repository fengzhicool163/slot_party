/**
 * Created by lixiaodong on 16/12/22.
 */
var _ = require('underscore');

var configName = process.env.GAME_CONFIG_SUFFIX || 'dev';
var gameConfig = require('../../game_' + configName + '.json');
var env = process.env.GAME_ENV || 'dev';
var port = process.env.PORT || '5316';
var lobbyPort = process.env.LOBBYPORT || '5400';

console.log('port: ',port,' lobbyPort:',lobbyPort);

gameConfig.potHostUrl = gameConfig.potHostUrl.replace(/%PORT/g, parseInt(port) + 1);
gameConfig.lobbyHostUrl = gameConfig.lobbyHostUrl.replace(/%PORT/g, parseInt(lobbyPort));
gameConfig.redis.prefix = gameConfig.redis.prefix.replace(/%GAME_ENV/g, env);
gameConfig.mongo.server_url = gameConfig.mongo.server_url.replace(/%GAME_ENV/g, env);
if (gameConfig.mongo.server_opts && gameConfig.mongo.server_opts.user) {
    gameConfig.mongo.server_opts.user = gameConfig.mongo.server_opts.user.replace(/%GAME_ENV/g, env);
}
gameConfig.server_name = (process.env.name || 'up-slot-local');
gameConfig.server_port = port;
gameConfig.enable_jobs = (process.env.GAME_JOB == 'true');

console.warn('泳池版本老虎机');
console.log('slot-server name: ' + gameConfig.server_name);
console.log('slot-redis prefix: ' + gameConfig.redis.prefix);
console.log('slot-mongo server_url: ' + gameConfig.mongo.server_url);
console.log('slot-pot url: ' + gameConfig.potHostUrl);
console.log('slot-lobby url: ' + gameConfig.lobbyHostUrl);
console.log('slot-enable-jobs', gameConfig.enable_jobs);
console.log('slot-process.env.TZ', process.env.TZ);

exports.gameConfig = gameConfig;

function getTimeAt(parHour){
    var oneDay = 24 * 60 * 60 * 1000;
    var fourHours = parHour * 60 * 60 * 1000;
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    month  = month < 10 ? month : '0'+month;
    day  = day < 10 ? day : '0'+day;
    var morning = new Date(year+'-'+month+'-'+day+' 00:00:00').getTime();
    var night = morning + oneDay;

    var hour = now.getHours();
    var time = 0;
    if(hour >= parHour){
        time = night + fourHours;
    } else {
        time = morning + fourHours;
    }
    return time;
}

exports.getTimeAt = getTimeAt;

/**
 * 根据权重数组 获取随机数所在权重索引
 * @param array
 */
exports.getRandomIndexByWeight = function(array){
    var rateArray = overlay(array);

    var max = rateArray[rateArray.length - 1];

    var random = parseInt(Math.random() * max) + 1;

    return getRateIndex(rateArray, random);
}

//函数元素叠加
function  overlay(array){
    if(!array || !array.length || !(array instanceof Array)){
        return [];
    }

    var rate = [];
    array.forEach(function (value,index) {
        var tempArr = array.slice(0, index + 1);
        //memo 上一次计算的结果
        rate.push(_.reduce(tempArr, function (memo,num) {
            return memo + num;
        },0));
    });
    return rate;
}

function getRateIndex (array,rate){
    var index = _.sortedIndex(array, rate);
    return index;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getMNTime(date){
    var curr = new Date();
    if(!!date){
        curr = new Date(date);
    }

    var year = curr.getFullYear();
    var month = curr.getMonth() + 1;
    month = month < 10 ? '0'+month : month;
    var day = curr.getDate();
    day = day < 10 ? '0'+day : day;

    var fulldate = year + '-' + month + '-' + day + ' 00:00:00';

    var morning = new Date(fulldate).getTime();
    var night = morning + 24 * 60 * 60 * 1000;
    return {morning : morning, night : night};
}

function atDay(time){
    var date = new Date();
    var signDate = new Date(time);

    return (date.getDate() == signDate.getDate()
    && date.getMonth() == signDate.getMonth()
    && date.getYear() == signDate.getYear());
}

function getDevice(req) {
    var useragent = req.header('user-agent');
    var iOS = ( useragent.match(/(iPad|iPhone|iPod)/i) ? true : false );
    var isAndroid = useragent.match(/Android/i) ? true : false;

    if (iOS) {
        return 'ios';
    } else if (isAndroid) {
        return 'android';
    } else {
        return 'other';
    }
}

/**
 * 获取本周末24点的时间戳
 * @returns {number}
 */
function getTimeAtWeekEnd(){
    var oneDay = 24 * 60 * 60 * 1000;
    var mnTime = getMNTime();
    var currDate = new Date(mnTime.night - 1000);
    var day = currDate.getDay();
    var time = 0;
    if(day == 0){
        time = mnTime.night - Date.now();
    } else {
        time = (7 - day) * oneDay + mnTime.night - Date.now();
    }

    return time;
}

function update(value){
    value = (value < 10 ) ? '0' + value : value;
    return value;
}

//返回201606271801363210
function createOrderId(){
    // var date = new Date();
    // var year = date.getFullYear();
    // var month = date.getMonth() + 1;
    // month = update(month);
    // var day = date.getDate();
    // day = update(day);
    // var hour = date.getHours();
    // hour = update(hour);
    // var minu = date.getMinutes();
    // minu = update(minu);
    // var seco = date.getSeconds();
    // seco = update(seco);
    // var orderId = ''+year+month+day+hour+minu+seco+(date.getTime()+'').substring(9);
    var uuid = require('uuid');

    return uuid.v1();
}

function getFormatDate(time){
    time = time || Date.now();
    var date = new Date(time);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = update(month);
    var day = date.getDate();
    day = update(day);
    var hour = date.getHours();
    hour = update(hour);
    var minu = date.getMinutes();
    minu = update(minu);
    var seco = date.getSeconds();
    seco = update(seco);

    return year+'-'+month+'-'+day+' '+hour+':'+minu+':'+seco;
}

/**
 *
 * @param range 间隔小时
 * @returns {number}
 */
function getNextJobTime(range) {
    var now = Date.now();
    var nextTime = getMNTime().morning;
    var gap = range * 60 * 60 * 1000;
    while (nextTime < now) {
        nextTime += gap;
    }
    return nextTime;
}

exports.getNextJobTime = getNextJobTime;

exports.getFormatDate = getFormatDate;

exports.createOrderId = createOrderId;

exports.getTimeAtWeekEnd = getTimeAtWeekEnd;

exports.atDay = atDay;

exports.getMNTime = getMNTime;

exports.getRandomInt = getRandomInt;

exports.getRateIndex = getRateIndex;

exports.overlay = overlay;

exports.getDevice = getDevice;