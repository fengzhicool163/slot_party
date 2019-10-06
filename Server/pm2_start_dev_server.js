/**
 * Created by liangrui on 11/21/16.
 */
var async = require('async');
var pm2 = require('pm2');

var game_env = process.argv[2];
var gameConfig, isConnected, pm2Apps = {};

function getAppConfig(appConfigName, envName, port,lobbyPort) {
	var appConfig;
	for (var i = 0; i < gameConfig.apps.length; i++) {
		if (gameConfig.apps[i].name == appConfigName) {
			appConfig = gameConfig.apps[i];
			break;
		}
	}

   	if (appConfig) {
   		appConfig = JSON.stringify(appConfig);
	    appConfig = appConfig.replace(/%GAME_ENV/g, envName);
	    appConfig = appConfig.replace(/%PORT/g, port);
        if(lobbyPort){
            appConfig = appConfig.replace(/%LOBBYPORT/g, lobbyPort);
        }
	    appConfig = JSON.parse(appConfig);
   	}

    return appConfig;
}

async.waterfall([
    function (cb) {
        if (!game_env) {
            return cb('missing game env');
        }
        gameConfig = require('../game_dev.json');
        cb();
    },
    function (cb) {
        var appConfig = gameConfig && gameConfig.targets && gameConfig.targets[game_env];
        if (!!appConfig) {
        	var port = appConfig['server'];
            var potPort = appConfig['potServer'];
            var lobbyPort = appConfig['lobbyServer'];
        	if (!port) {
        		return cb('missing port');
        	}

            appConfig = getAppConfig('server-up-casino-slot-party-%GAME_ENV', game_env, port,lobbyPort);
            pm2Apps[appConfig.name] = appConfig;

            appConfig = getAppConfig("server-up-casino-slot-party-jack-%GAME_ENV", game_env, potPort);
            pm2Apps[appConfig.name] = appConfig;

            console.log('pm2Apps>>>>',pm2Apps);
            cb();
        } else {
            return cb('not find any app config or pm2 tasks on: ' + game_env);
        }
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
            // console.log('appNames running:', appNames);
            async.mapSeries(appNames, function (appName, next) {
                if (!!pm2Apps[appName]) {
                    pm2.stop(appName, function(err) {
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
        var appNum = appNamesToStart.length;
        console.log('appNamesToStart:', appNamesToStart);
        async.mapSeries(appNamesToStart, function (appName, next) {
            pm2.start(pm2Apps[appName], function (err, proc) {
                console.log('start pm2 app', appName, ', err:', err);
                appNum--;
                if (appNum == 1) {
                	setTimeout(function() {
                		next();
                	}, 1000);
                } else {
                	next();
                }
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
