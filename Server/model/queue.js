/**
 * 任务队列模块
 * Created by lixiaodong on 17/1/4.
 */
var async = require('async');

function Queue() {
    this.queue = null;
    this.createQueue();
}

var p = Queue.prototype;

p.createQueue = function () {
    var q = async.queue(function (task,callback) {
        task(function (err,data) {
            callback(err,data);
        });
    });

    this.queue = q;
}

p.pushTask = function (task, next) {
    var self = this;
    self.queue.push(task, next);
}

module.exports = new Queue();