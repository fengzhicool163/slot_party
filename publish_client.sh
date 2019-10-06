#!/bin/bash
#遇到任何错误则终止脚本
set -e
set -o pipefail

if [ $# -lt 2 ];then
echo "Usage:"
echo "    sh publish_client.sh [target] [edition]"
echo "valid targets:[dev|prod|prodstage]"
echo "valid edition:[asia]"
echo ""
echo "etc: sh publish_client.sh dev asia"
echo ""
exit 1
fi

#检查参数
build_target=$1
build_edition=$2

#检查环境合法性
target_list=("dev" "prod" "prodstage")
if [[ " ${target_list[@]} " =~ " ${build_target} " ]] ;then
	echo "build target: ${build_target}"
else
	echo "invalid target ${build_target}"
	exit 1
fi
#检查edition合法性
edition_list=("asia" "me")
if [[ " ${edition_list[@]} " =~ " ${build_edition} " ]] ;then
	echo "build edition: ${build_edition}"
else
	echo "invalid edition ${build_edition}"
	exit 1
fi

build_release_name="${build_target}_${build_edition}"
build_config_name="game_${build_target}_${build_edition}.json"
res_deploy_path="http://g.cdn.upliveapp.com/up_casino_slot_party_${build_edition}/"
isDevEnv=1
isProdStage=0
if [ ${build_target} == "prod" ];then 
	isDevEnv=0
elif [ ${build_target} == "prodstage" ];then
	isProdStage=1
else
	build_config_name="game_dev.json"
fi
echo "build_config_name: ${build_config_name}"

#初始化参数
path_git=$(pwd)
path_project=$(pwd)/Client/UpGame/
path_server=$(pwd)/Server/
path_server_public=$(pwd)/Server/public/
branch_name=$(git branch | grep \* | awk '{print $2}')

#清理目录
function gitClean() 
{
	git checkout .
	git clean -fd
	git reset --hard HEAD
	git pull
}

#更新版本号
function bumpVersion()
{
	cd "${path_git}"

	sh bump_version.sh "${build_config_name}"

	client_version_new=$(cat ${build_config_name} | grep version | awk -F"\"" '{print $4}' | sed 's/\//\\&/g')
	path_publish=$(pwd)/Client/UpGame/bin-release/web/${client_version_new}/

	git commit -a -m "BUMP VERSION OF ${build_config_name} TO ${client_version_new}"
	git push origin "${branch_name}"
	
	echo ""
	echo "client_version_new: ${client_version_new}"
	echo "path_publish: ${path_publish}"
}

#编译项目
function compileProject()
{
	#编译项目
	cd "${path_git}"
	rm -rf "${path_publish}"
	mkdir -p "${path_publish}"

	cd "${path_project}"
	# 编译
	egret publish --version ${client_version_new}

	# 清除奇怪的文件
	cd ${path_publish}
	if [ -f "main.min.js.map" ]; then
		rm -rf main.min.js.map
	fi
}

#处理admin相关文件
function prepareAdminFiles()
{
	cd "${path_project}"
	#拷贝admin
	if [ $isDevEnv -eq 1 ]; then
		cp -f admin.html ${path_publish}
		cp -Rf libs/jquery ${path_publish}libs/
	fi
	#拷贝其他第三方库
	cp -Rf libs/pace ${path_publish}libs/
}

#hash所有的js，避免缓存问题
function hashJavaScripts()
{
	cd "${path_git}"
	if [ $isDevEnv -eq 1 ];then
		res_deploy_path=""
	fi
	res_deploy_path=$(echo ${res_deploy_path//\//\\\/})
	echo "deploy path: $res_deploy_path"

	echo "sh hash_javascripts.sh ${path_publish} ${res_deploy_path}"
	sh hash_javascripts.sh "${path_publish}" "${res_deploy_path}"
}

#压缩图片和JSON文件
function compressResources()
{
	cd "${path_git}"
	echo "sh reduce_resource_size.sh ${path_publish} ${res_deploy_path}"
	sh reduce_resource_size.sh "${path_publish}" "${res_deploy_path}"
}

#提交release
function commitRelease()
{
	cd "${path_git}"
	if [ ! -d "${path_git}/Server/public" ];then
		mkdir "${path_git}/Server/public"
	fi
	rm -rf ./Server/public/*
	cp -Rf ${path_publish}* ./Server/public

	git add --all ./Server/public
	git_change_log=$(git status ./Server/)
	if echo "${git_change_log}" | grep -q "nothing to commit";then
		echo "nothing changed, no need to commit"
	else
		git commit -m "GAME RELEASE ${build_release_name} ${client_version_new}"
		git push origin "${branch_name}"
	fi

	if [ $isDevEnv -eq 0 -o $isProdStage -eq 1 ]; then
		#TOOD, 需要检查TAG是否存在
		tag_name="${build_release_name}_${client_version_new}"
		git tag "${tag_name}"
		git push origin "${tag_name}"
	fi
}

#发布到服务器
function syncServer()
{
	if [ $isDevEnv -eq 1 ]; then
		if [ $isProdStage -eq 1 ]; then
			echo "skip prodstage"
		else
			cd ${path_git}
			sh sync_server.sh ${build_edition} client
		fi
	fi
}

function gitCleanAfter()
{
	cd ${path_git}
	git checkout .
	git clean -fd
}


echo ""
echo "------------- git clean"
gitClean;
echo "------------- bump version"
bumpVersion;
echo "------------- compile project"
compileProject;
echo "------------- prepareAdminFiles"
prepareAdminFiles;
echo "------------- hash javascripts"
hashJavaScripts;
echo "------------- compress resources"
compressResources;
echo "------------- commit release"
commitRelease;
echo "------------- sync server"
syncServer;
echo "------------- git clean after"
gitCleanAfter;
echo ""
echo "!!publish client done!!"
