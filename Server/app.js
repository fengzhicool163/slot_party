if(process.env['GAME_ENV'] == 'prod'){
    require('tingyun');
}

var express = require('express');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var compression = require('compression');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var util = require('./util/util');
var game_dev = util.gameConfig;

//加载配置到内存中
var configUtil = require('./util/configUtil');
var configLoad = require('./util/configLoad');
configUtil.loadGameConfig(configLoad.loadConfig());

var app = express();

app.use(compression());

app.use(logger(':method :url :response-time ms'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: '*/*' }));
app.use(cookieParser());

// Access Control
app.use(function (req, res, next) {
    var origin = (game_dev.allow_origin == '*' ? req.headers.origin : game_dev.allow_origin);
    if (!origin) origin = '*';

    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Content-Type", "text/html;charset=utf-8");
    next();
});

var router = express.Router();
//load routes
var loadRoutes = function(){
    var dirName = __dirname;
    var routesPath = path.join(dirName,'/routes');
    var files = fs.readdirSync(routesPath);
    for(var i = 0; i < files.length; i ++){
        var filePath = path.join(routesPath,files[i]);
        if(!fs.statSync(filePath).isDirectory() && filePath.indexOf('.js') != -1){
            var model = require(filePath);
            for(var key in require(filePath)){
                if(typeof(model[key]) ==  'function'){
                    router.post('/' + key,model[key]);
                }
            }
        }
    }
};

loadRoutes();
app.use('/',router);

mongoose.connect(game_dev.mongo.server_url, game_dev.mongo.server_opts, function(err) {
    console.log('Mongoose default connection callback, err:' + err);
});

mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + game_dev.mongo.server_url);
});
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection open to ' + game_dev.mongo.server_url + ' error: '+err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});
mongoose.connection.once('open', function () {
    console.log('connected to mongodb!', game_dev.mongo.server_url);
});



var nodeMailer = require('./model/nodemailer');
process.on('uncaughtException', function (err) {
    console.error('uncaughtException error:',err);
    console.error(err.stack);
    if (game_dev.send_mail_on_error) {
        nodeMailer.sendMail(game_dev.server_name + '-error', err + '' + err.stack);
    }
});

if (game_dev.send_mail_on_start) {
    var title = [game_dev.server_name + '-start', process.pid, new Date()].join(' , ');
    var content = (new Date()) + '';
    nodeMailer.sendMail(title, content);
}

module.exports = app;
