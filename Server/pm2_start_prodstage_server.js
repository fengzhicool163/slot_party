/**
 * Created by liangrui on 9/19/16.
 */

var os = require('os');
var async = require('async');
var pm2 = require('pm2');

var hostname = os.hostname();
var gameConfig, isConnected, pm2Apps = {};

console.log('hostname:', hostname);

function getAppConfig(gameConfig, appName) {
    var appConfig;

    if (!!appName) {
        for (var i = 0; i < gameConfig.apps.length; i++) {
            if (gameConfig.apps[i].name == appName) {
                appConfig = gameConfig.apps[i];
                break;
            }
        }
    }

    console.log('getAppConfig: ', appConfig);
    return appConfig;
}

async.waterfall([
    function (cb) {
        var game_config_name = process.argv[2];
        if (!game_config_name) {
            return cb('missing game config name');
        }
        gameConfig = require('../' + game_config_name);
        //console.log('game_config', game_config);
        cb();
    },
    function (cb) {
        var hostApps = gameConfig && gameConfig.hosts && gameConfig.hosts[hostname];
        if (!!hostApps && hostApps.length) {
            //console.log('host apps', hostApps);
            for (var i = 0; i < hostApps.length; i++) {
                var appConfig = getAppConfig(gameConfig, hostApps[i]);
                //console.log('appConfig', appConfig);
                if (!!appConfig) {
                    pm2Apps[appConfig.name] = appConfig;
                }
            }
        } else {
            console.error('not find any host config or pm2 tasks on: ' + hostname);
        }
        cb();
    },
    function (cb) {
        pm2.connect(function(err) {
            if (!!err) {
                return cb(err);
            }
            isConnected = true;
            cb();
        });
    },
    function (cb) {
        pm2.list(function(err, processDescriptionList) {
            if (!!err) {
                return cb(err);
            }

            var appNamesRunning = {};
            if (!!processDescriptionList) {
                for (var i = 0; i < processDescriptionList.length; i++) {
                    var runningAppName = processDescriptionList[i].name;
                    appNamesRunning[runningAppName] = 1;
                }
            }
            var appNames = Object.keys(appNamesRunning);
            console.log('appNames running:', appNames);
            async.mapSeries(appNames, function (appName, next) {
                if (pm2Apps[appName]) {
                    pm2.stop(appName, function (err) {
                        console.log('stop pm2 name:', appName, ', err:', err);
                        next();
                    });
                } else {
                    next();
                }
            }, function (err) {
                console.log('stop or delete running pm2 apps, err:', err);
                cb();
            });
        });
    },
    function (cb) {
        var appNamesToStart = Object.keys(pm2Apps);
        async.mapSeries(appNamesToStart, function (appName, next) {
            pm2.start(pm2Apps[appName], function (err, proc) {
                console.log('start pm2 app', appName, ', err:', err);
                next();
            });
        }, function (err) {
            cb(err);
        });
    }
], function(err) {
    if (isConnected) {
        console.log('pm2 disconnect');
        pm2.disconnect();
    }

    if (!!err) {
        console.error('err:', err);
        process.exit(2);
    }

    console.log('complete');
});
