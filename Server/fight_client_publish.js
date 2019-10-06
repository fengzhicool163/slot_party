/**
 * Created by liangrui on 4/19/16.
 */

var async = require('async');
var fs = require('fs');
var path = require('path');
// var browserify = require('browserify');
// var UglifyJS = require("uglify-js");

// var underscore_path = path.join(__dirname, '../Client/FightGame/libs/underscore/underscore.js');
// var underscore_min_path = path.join(__dirname, '../Client/FightGame/libs/underscore/underscore.min.js');

// var fight_client_path = path.join(__dirname, '../Client/FightGame/libs/fight/fight_client.js');
// var fight_client_min_path = path.join(__dirname, '../Client/FightGame/libs/fight/fight_client.min.js');

var game_config_path = path.join(__dirname, '../Client/UpGame/resource/config/');
var game_config_name = process.argv[2] || 'game_dev.json';

async.waterfall([
    function (cb) {
        console.log('\nstep 1: pack game config');
        var configLoad = require('./util/configLoad.js');
        configLoad.packConfig(game_config_path);
        cb();
    },
    // function (cb) {
    //     console.log('\nstep 2: browserify underscore');
    //     var b = browserify();
    //     b.require('./node_modules/underscore/', {expose:'underscore'});
    //     var bundle = b.bundle();
    //     bundle.on('error', function(err) {
    //         cb(err);
    //     });
    //     var stream = fs.createWriteStream(underscore_path);
    //     stream.on('finish', function(err) {
    //         console.log('browserify successfully generate underscore.js');
    //         cb(err);
    //     });
    //     bundle.pipe(stream);
    // },
    // function (cb) {
    //     console.log('\nstep 3: uglifyjs compress underscore.js');
    //     var result = UglifyJS.minify(underscore_path, {
    //         mangle: true,
    //         compress: true
    //     });
    //     fs.writeFile(underscore_min_path, result.code, function(err) {
    //         if (err) {
    //             cb(err);
    //         } else {
    //             console.log('uglifyjs compress successfully  -->  ', underscore_min_path, new Date());
    //             cb();
    //         }
    //     });
    // },
    // function (cb) {
    //     console.log('\nstep 4: browserify fight_client.js');
    //     var b = browserify({standalone:'fightClient'});
    //     b.add('./fight_client.js');
    //     b.external('underscore');
    //     var bundle = b.bundle();
    //     bundle.on('error', function(err) {
    //         cb(err);
    //     });
    //     var stream = fs.createWriteStream(fight_client_path);
    //     stream.on('finish', function(err) {
    //         console.log('browserify successfully generate fight_client.js');
    //         cb(err);
    //     });
    //     bundle.pipe(stream);
    // },
    // function (cb) {
    //     console.log('\nstep 5: uglifyjs compress fight_client.js');
    //     var result = UglifyJS.minify(fight_client_path, {
    //         mangle: true,
    //         compress: true
    //     });
    //     fs.writeFile(fight_client_min_path, result.code, function(err) {
    //         if (err) {
    //             cb(err);
    //         } else {
    //             console.log('uglifyjs compress successfully  -->  ', fight_client_min_path, new Date());
    //             cb();
    //         }
    //     });
    // },
    function (cb) {
        console.log('\nstep 6: bump client version');
        var parentDir = path.resolve(process.cwd(), '..');
        var cmd = 'sh bump_version.sh ' + game_config_name;
        if (game_config_name.indexOf('prod') != -1) {
            cmd += ' force';
        }
        console.log('cmd: ' + cmd);

        var callfile = require('child_process');
        callfile.exec(cmd,
            {cwd:parentDir},
            function (err, stdout, stderr) {
                if (err) {
                    cb(err);
                } else {
                    console.log(stdout);
                    cb();
                }
            }
        );
    }
], function (err) {
    if (err) console.log('err:', err);
    else console.log('fight client publish complete');
});

