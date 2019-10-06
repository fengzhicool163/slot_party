#!/bin/bash
#遇到任何错误则终止脚本
set -e
set -o pipefail

if [ $# -lt 2 ];then
echo "Usage:"
echo "    sh hash_javascripts.sh [resource_path] [deploy_path]"
echo ""
echo "etc: sh hash_javascripts.sh Client/UpGame/bin-release/web/0.0.0.881/ http://n.cdn.pengpengla.com/tacticsgame/prod/"
echo ""
exit 1
fi

path_publish=$1
res_deploy_path=$2

echo ""
echo "hash_javascripts begin"

if [ ! -d "${path_publish}" ];then
	echo "missing folder: ${path_publish}"
	exit 1
fi

cd "${path_publish}"

if [ ! -d "js" ];then
	mkdir js
fi

res_files=""
if [ -d "libs" ];then
	res_files=$(find libs -type f \( ! -regex ".*/\..*" \))
fi
if [ -f "main.min.js" ];then
	res_files="${res_files} main.min.js"
fi
if [ -f "all.manifest" ];then
	mv all.manifest all.manifest.json
	res_files="${res_files} all.manifest.json"
fi

for resFileName in ${res_files}
do
	res_ext=${resFileName##*.}

	if echo "${res_ext}" | grep -q -E "js|css|json";then
		res_md5=$(md5 -q ${resFileName})
		#去掉前8位，去掉后8位，取中间的16位，其中前2位为目录名，后14位为文件名
		res_hash_folder="${res_md5:8:2}"
		res_md5=${res_md5:10:14}
		res_hash_path="js/${res_hash_folder}/${res_md5}.${res_ext}"
		if [ ! -d "js/${res_hash_folder}" ];then
			mkdir "js/${res_hash_folder}"
		fi

		echo "${resFileName} path:${res_hash_path}"
		cp "${resFileName}" "${res_hash_path}"
		
		res_orig_path=$(echo ${resFileName//\//\\\/})

		for res_html in $(ls *.html)
		do
			echo "replace js path in: ${res_html}"

			res_hash_path="${res_deploy_path}js/${res_hash_folder}/${res_md5}.${res_ext}"
			res_hash_path=$(echo ${res_hash_path//\//\\\/})

			if echo "${res_ext}" | grep -q "js";then
				sed -i '' "s/src=\"${res_orig_path}/src=\"${res_hash_path}/g" "${res_html}"
			fi
			sed -i '' "s/${res_orig_path}/${res_hash_path}/g" "${res_html}"
		done
	fi
done
if [ -d "libs" ];then
	rm -rf libs
fi
if [ -f "main.min.js" ];then
	rm -rf main.min.js
fi
if [ -f "all.manifest.json" ];then
	rm -rf all.manifest.json
fi
echo "hash_javascripts complete"
echo ""