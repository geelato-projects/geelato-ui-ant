# 快速上手
::: warning 注意
请确保你的 Node.js 版本 >= 9。
已安装[yarn](https://www.yarnpkg.com/zh-Hant/docs/install)。
:::

## 创建项目
基于vue cli，详见vue cli官网介绍，[创建一个项目](https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create)。
```
vue create hello-world
```

## 添加依赖
```
cd hello-world
yarn add ant-design-vue
yarn add axios
yarn add lodash.get
yarn add lodash.pick
yarn add geelato-ui-ant

yarn add html-webpack-plugin@4.0.0-beta.4 -D
yarn add less -D
yarn add less-loader -D

```
## 添加vue.config
在工程的根目录下添加vue.config，配置less的javascriptEnabled为true，设置服务端口port如下。
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
  },
  devServer: {
    port: 9090
  }
}
```
## 初始配置

修改src目录下的main.js，增加以下内容。
``` javascript
// 导入antd，对于导入antd.less，注意设置config.js中less的javascriptEnabled: true才可正常执行
import AntDesign from 'ant-design-vue'
import 'ant-design-vue/dist/antd.less'

// 导入geelatoAui
import geelatoAui from 'geelato-ui-ant'
import 'geelato-ui-ant/lib/geelato-ui-ant.css'

// geelatoAui已内置了api,默认可调用http://localhost:8080/api的相关服务
// 可以自行实现api，再调用geelatoAui.setApi(api)
// 这里采用geelatoAui默认的api的方式。只进行请求拦截，不重置原有的api。
// 以下service是Axios实例
// import apiHelper from './apiHelper'
// const service = geelatoAui.api.getService()
// apiHelper.interceptors(service)

Vue.prototype.$gl ? Vue.prototype.$gl.api = geelatoAui.api : Vue.prototype.$gl = {api: geelatoAui.api}

let apiOptions = {api: {baseURL: 'http://localhost:8080/api'}}
// 注册组件库
Vue.use(geelatoAui, apiOptions)
Vue.use(AntDesign)

```
## 编写示例
- 准备数据
src\components\data.js

<<< @/docs/.vuepress/components/Form/Base/data.js

- 创建示例文件
src\components\Example.vue

<<< @/docs/.vuepress/components/Form/Base/Example.vue

- 修改app.vue，导入并使用Example组件。
``` vue
<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <example></example>
  </div>
</template>

<script>
  import HelloWorld from './components/HelloWorld.vue'
  import Example from './components/Example.vue'

  export default {
    name: 'app',
    components: {
      HelloWorld, Example
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
```
## 运行
```
yarn serve
```
