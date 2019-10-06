/**
 * 邮件schema
 * Created by lixiaodong on 16/12/22.
 */

var mongoose = require('mongoose');
/**
 * type 1:排行榜奖励
 */
var mailSchema = new mongoose.Schema({
    uid         :   String,
    type        :   Number,
    diamond     :   Number,
    status      :   Number,
    createTime  :   Number
},{minimize:false});


mailSchema.pre('save',function (next) {
    var self = this;

    next();
});

var mailModel = mongoose.model('mail',mailSchema);

module.exports = mailModel;