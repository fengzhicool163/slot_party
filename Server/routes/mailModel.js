/**
 * Created by lixiaodong on 16/12/22.
 */

var mailDao = require('../dao/mailDao');

function queryMailInfoByUid(uid, next){
    mailDao.queryByUid(uid,next);
}

function addMails(mails,next) {
    mailDao.addMails(mails,next);
}

module.exports = {
    addMails    :   addMails,
    queryMailInfoByUid  :   queryMailInfoByUid
}