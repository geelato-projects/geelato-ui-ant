---
sidebar: auto
---

# 配置

## 主题
基于vue.ant.design的主题进行修性，如果是基于vue-cli3开发，可在vue.config文件中配置、修改以下信息。更多的主题变量，可参考[vue.ant.design官网的主题介绍](https://vue.ant.design/docs/vue/customize-theme-cn/)。

``` json
module.exports = {
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */
          'primary-color': '#2185d0',
          'link-color': '#2185d0',
          'border-radius-base': '0px'
        },
        javascriptEnabled: true
      }
    }
 }
}
```

::: warning 注意
 若工程无文件vue.config，可在工程的根目录下添加，即与package.json在同一目录下。
:::

