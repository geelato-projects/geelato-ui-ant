#!/bin/bash
# ==================== #
# geelato-ui-ant lib   #
# ==================== #
# 以下脚本采用git bash执行
# 确保脚本抛出遇到的错误
set -e

# 打包
yarn lib

# 发布到npm库
npm publish

pause
