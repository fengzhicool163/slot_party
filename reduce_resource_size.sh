#!/bin/bash
#遇到任何错误则终止脚本
set -e
set -o pipefail

if [ $# -lt 2 ];then
echo "Usage:"
echo "    sh reduce_resource_size.sh [resource_path] [path_prefix]"
echo ""
echo "etc: sh reduce_resource_size.sh Client/UpGame/bin-release/native/0.0.0.881/"
echo ""
exit 1
fi

path_publish=$1
path_prefix=$2
path_server_public=$(pwd)/Server/public/
path_pngquant=$(pwd)/Client/tools/pngquant

if [ ! -d "${path_publish}" ];then
    echo "missing folder: ${path_publish}"
    exit 1
fi

##需要忽略压缩的文件列表
manifest_json_path=$(cat ${path_publish}/index.html | grep MANIFEST_URL | awk -F"'" '{print $2}')
if [ ! -z "${path_prefix}" ];then
    manifest_json_path=$(echo ${manifest_json_path} | awk -F"${path_prefix}" '{print $2}')
fi
manifest_json_path="${path_publish}${manifest_json_path}"
ignore_path_list=$(node reduce_resource_size_whitelist.js ${manifest_json_path})

##遍历所有资源文件
cd "${path_publish}"

res_files=$(find * -type f \( ! -regex ".*/\..*" \))
for resFileName in ${res_files}
do
    res_ext=${resFileName##*.}

    #是否要跳过压缩，直接使用原始文件
    if echo "${ignore_path_list}" | grep -q "${resFileName}";then
        echo "${resFileName} ignored compress"
        continue
    fi

    #检查要压缩的文件是否已经在Server/public中存在，如果存在直接拷贝，不用重复压缩
    if echo "${res_ext}" | grep -q -E -i "png|json";then
        if [ -e "${path_server_public}${resFileName}" ]; then
            cp -f "${path_server_public}${resFileName}" "./${resFileName}"
            echo "${resFileName} --> direct copy from Server/public"
            continue
        fi
    fi

    #压缩指定的文件
    res_size_compress=""
    #压缩PNG
    if echo "${res_ext}" | grep -q "png";then
        res_size_compress="png_compress: "$(wc -c ${resFileName} | awk '{print int($1/1000)}')
        ${path_pngquant} --force --speed 1 --ext .png -- ${resFileName}
        res_size_compress="${res_size_compress} -> "$(wc -c ${resFileName} | awk '{print int($1/1000)}')

        #optipng的压缩率有限，没有必要
        #optipng -strip all -quiet -clobber -i0 "${resFileName}"
        #res_size_compress="${res_size_compress} -> "$(wc -c ${resFileName} | awk '{print int($1/1000)}')

        echo "${resFileName} ${res_size_compress}"
    fi
    #jpegtran的压缩率有限，没有必要
    #if echo "${res_ext}" | grep -q "jpg";then
    #   res_size_compress="jpg_compress: "$(wc -c ${resFileName} | awk '{print int($1/1000)}')
    #   jpegtran -copy none -optimize "${resFileName}" > "${resFileName}.temp"
    #   mv "${resFileName}.temp" "${resFileName}"
    #   res_size_compress="${res_size_compress} -> "$(wc -c ${resFileName} | awk '{print int($1/1000)}')
    #fi
    #压缩JSON
    if echo "${res_ext}" | grep -q "json";then
        res_size_compress="json_compress: "$(wc -c ${resFileName} | awk '{print int($1/1000)}')
        jq -c -S '.' "${resFileName}" >> "${resFileName}.new"
        mv "${resFileName}.new" "${resFileName}"
        res_size_compress="${res_size_compress} -> "$(wc -c ${resFileName} | awk '{print int($1/1000)}')

        echo "${resFileName} ${res_size_compress}"
    fi
done