/**
 * Created by lixiaodong on 16/12/27.
 */
var mongoose = require('mongoose');

var costLogSchema = new mongoose.Schema({
    rank    :   mongoose.Schema.Types.Mixed,
    createTime  :   Number
});


costLogSchema.pre('save',function (next) {
    next();
});

var costLogModel = mongoose.model('rank',costLogSchema);

module.exports = costLogModel;