/**
 * 邮件通知模块
 * Created by lixiaodong on 16/12/22.
 */

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var user = require('../lib/mailaccount.json');
var util = require('../util/util');

var opt = {
    port : 465,
    host : 'smtp.qq.com',
    auth : {
        user : user.user,
        pass : user.pass
    },
    secure : true
};

var transporter = nodemailer.createTransport(smtpTransport(opt));

var sendMail = function(subject,content){
    transporter.sendMail({
        from: user.user,
        to: 'ppcdev@asiainnovations.com',
        subject: subject,
        text: content
    }, function (err) {
        console.log('发送邮件完成, err:',err);
    });
};

var sendAlarmMail = function(subject,content){
    transporter.sendMail({
        from: user.user,
        to: util.gameConfig.alarmMail.join(','),
        subject: subject,
        text: content
    }, function (err) {
        console.log('发送邮件完成, err:',err);
    });
};

exports.sendMail = sendMail;
exports.sendAlarmMail = sendAlarmMail;