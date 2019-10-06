#!/bin/bash
#遇到任何错误则终止脚本
set -e
set -o pipefail

if [ $# -lt 1 ];then
echo "Usage:"
echo "    sh sync_server.sh [edition]"
echo ""
echo "valid edition:[asia|me]"
echo ""
echo "etc: sh sync_server.sh asia"
echo ""
exit 1
fi

build_edition=$1
build_client=$2
#初始化参数
build_proj="up-casino-slot-party"
path_git=$(pwd)
path_server=$(pwd)/Server/
path_config=./game_dev.json
path_deploy_client=/data/app/nginx/html/static/${build_proj}/${build_edition}
path_deploy=/data/work/${build_proj}/${build_edition}
server_ip=54.223.162.47

#检查edition合法性
edition_list=("asia" "me")
if [[ " ${edition_list[@]} " =~ " ${build_edition} " ]] ;then
	echo "build edition: ${build_edition}"
else
	echo "invalid edition ${build_edition}"
	exit 1
fi

echo "sync_server begin"

publishClient=0
if [ ! -z "${build_client}" ];then
	echo "also publish client"
	publishClient=1
fi

cd ${path_git}

sed -i '' "s/send_mail_on_error\": false/send_mail_on_error\": true/g" ${path_config}

cmd="mkdir -p ${path_deploy_client};mkdir -p ${path_deploy}"
ssh -tt -p 7922 node@${server_ip} "${cmd}"

if [ ! -f "env.txt" ]; then
	rsync -avcrzl --delete-after ./game_dev.json ./Server --exclude 'Server/logs' --exclude 'Server/public'  -e 'ssh -p 7922' node@${server_ip}:${path_deploy}/
else
	rsync -avcrzl --delete-after env.txt ./game_dev.json ./Server --exclude 'Server/logs' --exclude 'Server/public'  -e 'ssh -p 7922' node@${server_ip}:${path_deploy}/
fi

if [ $publishClient -eq 1 ]; then
	rsync -avcrzl --delete-after ./Server/public/* -e 'ssh -p 7922' node@${server_ip}:${path_deploy_client}/
fi

git checkout ${path_config}
#启动Server和ServerList
cmd="cd ${path_deploy};mkdir -p ./Server/logs;node ./Server/pm2_start_dev_server.js ${build_edition};"
ssh -tt -p 7922 node@${server_ip} "${cmd}"

echo "sync_server complete"

