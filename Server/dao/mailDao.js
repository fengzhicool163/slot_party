/**
 * Created by lixiaodong on 16/12/22.
 */
var schema = require('../schema/mail');

/**
 * 根据邮件ID 获取邮件详细信息
 * @param mailId
 * @param next
 */
function queryByMailId(mailId,next) {
    schema.findById(mailId).exec(next);
}

/**
 * 根据用户ID 查询所有邮件
 * @param uid
 * @param next
 */
function queryByUid(uid, next) {
    schema.findOne({uid    :   uid, status : 1}).exec(next);
}

function addMails(mails, next) {
    schema.create(mails, function (err) {
        next(err);
    });
}

module.exports = {
    queryByMailId   :   queryByMailId,
    queryByUid      :   queryByUid,
    addMails        :   addMails
}