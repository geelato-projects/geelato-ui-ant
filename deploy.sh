#!/bin/bash
# ==================== #
# geelato-ui-ant文档库  #
# ==================== #
# 以下脚本采用git bash执行
# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn docs:build

# 进入生成的文件夹
cd dist/docs

# 发布到自定义域名
echo ui.geelato.org > CNAME

git init
git add -A
git commit -m 'deploy'

# 发布到 https://geeloto-projects.github.io
 git push -f git@github.com:geelato-ui/geelato-ui.github.io.git master

pause
