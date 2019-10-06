#!/bin/sh
#遇到任何错误则终止脚本
set -e
set -o pipefail

rm -fr ./json/* ../Server/config/*.json
chmod u+x ./export.sh
node index.js --export
cp ./json/*.json ../Server/config/

cd ../Server
node fight_client_publish.js