/**
 * Created by lixiaodong on 16/12/22.
 */
/**
 * Created by lixiaodong on 16/4/15.
 */
var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var config = {
    "slotsgamecontent"     :   [],
    "slotsgameline"        :   ["line"],
    "slotsgamelinereward"  :   ["ID"],
    "slotsgamelist"        :   [],
    "slotsgameminigame"    :   ["id"],
    "slotsgamenimigamereward"  :   [],
    "slotsgamepotcontrol"  :   [],
    "slotsgameunit"        :   ["place"],
    "slotsgamecheatprize"   :   ["ID"]
};

//加载配置文件
exports.loadConfig = function () {
    var baseDir = '../config/';
    var gameConfig = {};

    for(var key in config){

        gameConfig[key] = {all : [], map : {}};
        delete require.cache[ require.resolve( baseDir + key + ".json" )];

        var tempConfig = require(baseDir + key + ".json");

        var mainKey = config[key][0];

        for(var i = 0, len = tempConfig.length; i < len; i++){

            gameConfig[key].all.push( tempConfig[i] );

            if(!!mainKey) {
                var tempId = tempConfig[i][mainKey];
                gameConfig[key].map[ tempId ] = gameConfig[key].map[ tempId ] || {};
                gameConfig[key].map[ tempId ] = tempConfig[i];
            }
        }
    }
    return gameConfig;
};

/**
 * 打包客户端配置
 * @param destPath
 */
exports.packConfig = function(destPath) {
    var baseDir = '../config/';
    var gameConfig = {
        "config": {}
    };
    var usedKeys = {
        "slotsgamelist"  :   1,
        "slotsgameunit"  :   1,
        "slotsgameline"  :   1,
        "slotsgamelinereward"  :   1,
        "slotsgameminigame"  :   1,
        "slotsgamecontent"  :   1,
        "slotsgamenimigamereward"  :   1,
    };

    var splitMethods = {
        "refreshUnit": splitRefreshUnit
    };

    for (var key in config) {
        var tempConfig = require(baseDir + key + ".json");

        if (usedKeys[key] == 1) {
            gameConfig['config'][key] = config[key];
            gameConfig[key] = tempConfig;
        }

        if (!!splitMethods[key]) {
            var subPath = destPath + key;
            try {
                fs.statSync(subPath);
            } catch (err) {
                fs.mkdirSync(subPath);
            }

            splitMethods[key](subPath, tempConfig);
        }
    }

    saveConfig(destPath + 'game_config.json', gameConfig);
};

function saveConfig(path, config) {
    fs.writeFileSync(path, JSON.stringify(config, null, 2));
    console.log('pack config successfully  -->  ', path, new Date());
}

function splitRefreshUnit(destPath, config) {
    var groups = _.groupBy(config, function(obj) {
        return obj.id;
    });

    for (var key in groups) {
        saveConfig(destPath + '/' + key + '.json', groups[key]);
    }
}