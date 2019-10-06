/**
 * Created by lixiaodong on 16/12/22.
 */
var _ = require('underscore');

//配置存储到内存中
var gameConfig;

exports.loadGameConfig = function (config) {
    gameConfig = config;
};

exports.getObjsByOpt = function (configName,opt) {
    if(!gameConfig[configName]){
        console.error('no_config_name:',configName);
        return null;
    }
    return _.where ( gameConfig[configName].all ,opt);
}

//根据ID 获取单个对象
exports.getObjById = function (configName,id) {
    if(!gameConfig[configName] || !gameConfig[configName].map){
        console.error('config_error:',configName);
        return null;
    }
    return gameConfig[configName].map[id];
};

exports.getObjByOpt = function (configName,opt) {
    if(!gameConfig[configName]){
        console.error('no_config_name:',configName);
        return null;
    }
    return _.findWhere(gameConfig[configName].all ,opt);
}

exports.getConfigByName = function (configName) {
    if(!gameConfig[configName]){
        console.log('no_config:',configName);
        return null;
    }
    return gameConfig[configName].all;
};