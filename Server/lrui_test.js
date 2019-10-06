/**
 * Created by liangrui on 26/12/2016.
 */

var crypto = require('crypto');
var request = require('request');
var constants = require('constants');

function createOrderId(){
    function update(value){
        value = (value < 10 ) ? '0' + value : value;
        return value;
    }

    var date = new Date();
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
    var orderId = ''+year+month+day+hour+minu+seco+(date.getTime()+'').substring(9);
    return orderId;
}

var privateKey = "-----BEGIN PRIVATE KEY-----\n\
MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAOOV6/9CfczqtwgW\n\
Y77n9dnnLMft7wDVGR6fxWVckDOcS3X4l3FklXzXYb8aBYNzgthY//9a3SfWtd4M\n\
SSerFOkwfNHzw1ZXEHgo5Jv2ttvlhEyvJhq/MACGotzkGEDinM/D3xUSLX+pxZgB\n\
Fr11Tqtzr8S7lm7YOg03CZh1EMDbAgMBAAECgYEAuQdQoW1LnehN+pNJcRJhfVFH\n\
xRwarlCSZaV79Ra2Xl95smXzqksehisN2zKqvN6SyJZDOzaCizszDV5rs4aSLiNk\n\
wQHWgMa4KhGvutZTbVBIz+G8xSq2LtnXBLHMumGzM8OJ9fMZGYfJR9VQmF4PgCgO\n\
/U68nDdqo8/oeWLW/YECQQD7IJAMRDwIqkeD0QFqCrTlNztq0eut4f2ePv/esL7S\n\
58CgOqZasAKuXFK+BFVV9BdS/vBmuRoFmHTTG7hgbyDhAkEA6ABrf/gDUxzglM8g\n\
LOo/wYhnXPa9OrRaGhvlql577biqSV6awq4PWIy9eIkj39tGNVrPeurnla9tO4pH\n\
YiDNOwJAI6LXTiZQrpobU+VQ4g9q5CwWTm5Dl4U+TDp8bMmACsXAW/x2pt/bQYrw\n\
Yu6SfYQJ20k6LBmQS8L6sQp5+5VJgQJAHZDwIj7ZLZ5ggJZk41R3C5L2mUJYm0Kg\n\
uPMVMcEYyhLeoLsNvgGwsvg8rT/M8ppfOC16g4+sM8dHhG766eaEQQJASpzhGNIW\n\
Z5kl+mb7w0NJCY8C0pHFGaiTXlUqG/MSeviwBp4Pctt4fuLdnGsJiqlykRRPuPC2\n\
cGEA2neH9XcB8Q==\n\
-----END PRIVATE KEY-----";

var privateKeyObj = {
    key: privateKey,
    padding: constants.RSA_PKCS1_PADDING
};

var appId = 'owngame10000';

//梁睿stage的uid
// var uid = 5010497;

//hs
// var uid = 5010500;
// var uid = 5010501;

//lxd
// var uid = 1000676;
// var uid = 5010505;

//大超
// var uid = 3000083;
// var uid = 5010457;

var users = {
    'lxd'   :   [5010505],
    'xje'   :   [5010499,5010501]
}
var oldHost = "https://up-b.pengpengla.com/open/";
var host = "https://up-b.pengpengla.com/open/";


//字节分组 128
function byte_split(buffer, number) {
    var bufferArray = [];

    for (var i = 0; i < buffer.length; i += number) {
        var temp = buffer.slice(i, i + number);
        bufferArray.push(temp);
    }
    return bufferArray;
}

function decrypt(encrypted) {
    //base64 解码
    var decrypted = new Buffer(encrypted,'base64');
    var bufferArray = byte_split(decrypted, 128);
    var final = '';

    for(var i = 0 ; i < bufferArray.length; i++){
        var decryptedFrag = crypto.privateDecrypt(privateKeyObj,bufferArray[i]);
        var decryptedStr = decryptedFrag.toString('utf8');

        for (var j = 0; j < decryptedStr.length; j++) {
            if(decryptedStr.charCodeAt(j) != 0){
                final += decryptedStr[j];
            }
        }
    }
    return JSON.parse(final);
}

function getBalanceInfo(uid,next) {
    var reqData = {
        uid : uid
    };

    var reqDataJson = JSON.stringify(reqData);

    var rsa = crypto.privateEncrypt(privateKey, new Buffer(reqDataJson)).toString('base64');

    var options = {
        url : host + 'getBalanceInfo',
        body    :   rsa,
        headers : {
            'appId' : appId
        },
        timeout: 5000
    };

    request.post(options, function(err,httpResponse,body){
        body = decrypt(body);
        // console.log('getBalanceInfo-body>>>>>>',body);
        next(err,body);
    });
}


function sendReward(uid,next){
    var reqData = {
        uid     :   uid,
        amount  :   100000000,
        type    :   1,
        orderId :   uid+'-'+createOrderId() + '-reward'
    };

    var reqDataJson = JSON.stringify(reqData);

    var rsa = crypto.privateEncrypt(privateKey, new Buffer(reqDataJson)).toString('base64');

    var options = {
        url : host + 'sendReward',
        body    :   rsa,
        headers : {
            'appId' : appId
        },
        timeout: 5000
    };

    request.post(options, function(err,httpResponse,body){
        body = decrypt(body);
        next(err,body);
    });
}

function buyLuckDrawChance(uid,next){
    var reqData = {
        uid : uid,
        diamond :   87340,
        orderId :   uid+'-'+createOrderId()+'-buy'
    };

    var reqDataJson = JSON.stringify(reqData);

    var rsa = crypto.privateEncrypt(privateKey, new Buffer(reqDataJson)).toString('base64');

    var options = {
        url : host + 'buyLuckDrawChance',
        body    :   rsa,
        headers : {
            'appId' : appId
        },
        timeout: 5000
    };

    request.post(options, function(err,httpResponse,body){
        body = decrypt(body);
        console.log('sendReward-body>>>>>>',body);
        next(err,body);
    });
}

function getUserInfoByUpLiveCode(code,next){
    var reqData = {
        word    : code,
        type    :   1
    };

    var reqDataJson = JSON.stringify(reqData);

    var rsa = crypto.privateEncrypt(privateKey, new Buffer(reqDataJson)).toString('base64');

    var options = {
        url : host + 'getUserInfo',
        body    :   rsa,
        headers : {
            'appId' : appId
        },
        timeout: 5000
    };

    request.post(options, function(err,httpResponse,body){
        body = decrypt(body);
        console.log('getUserInfoByUpLiveCode>>>>>',body);
        next(err,body.info);
    });
}

function getSendOutDiamond(uid, beginTime, endTime, next) {
    var reqParams = {
        uid         :   parseFloat(uid),
        beginTime   :   beginTime / 1000,
        endTime     :   endTime / 1000
    };

    var rsa = crypto.privateEncrypt(privateKey, new Buffer(JSON.stringify(reqParams))).toString('base64');

    var options = {
        url : host + 'getSendOutDiamond',
        body    :   rsa,
        headers : {
            'appId' : appId
        },
        timeout: 5000
    };

    request.post(options, function(err,httpResponse,body){
        body = decrypt(body);
        next(err,body.info);
    });
}

function getUserInfoByUid(uid,next){
    //type 0:uid, 1:up号[uplivecode]
    var reqData = {
        word    : uid,
        type    :   0
    };

    var reqDataJson = JSON.stringify(reqData);

    var rsa = crypto.privateEncrypt(privateKey, new Buffer(reqDataJson)).toString('base64');

    var options = {
        url : host + 'getUserInfo',
        body    :   rsa,
        headers : {
            'appId' : appId
        },
        timeout: 5000
    };

    request.post(options, function(err,httpResponse,body){
        body = decrypt(body);
        console.log('body>>>>>',body);
        next(err,body.info);
    });
}

var async = require('async');
var code = 'tk9900';
// var uid = users[process.env[0]][process.env[1]];//mgcnga
var uid = 5010501; //吃肉的小花
// async.waterfall([
//     function (cb) {
//         getUserInfoByUid(uid,function (err,data) {
//             console.log(err,data);
//             cb();
//         });
//     },
//     function (cb) {
//         sendReward(uid,function (err,data) {
//             console.log('-----',err,data);
//             cb(err);
//         });
//     }
// ],function (err) {
//
// });
var uids = [5010574]
async.mapSeries(uids, function(uid, call){
    sendReward(uid,function (err,data) {
        console.log('----->>',uid,err,data);
        call(err);
    });
},function(err){

})
