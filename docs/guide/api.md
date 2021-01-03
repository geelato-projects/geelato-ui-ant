# 实例
在vue的实体属性的基础上，增加了本UI框架的属性$gl，提供接口服务、工具方法等，可通过vm.$gl获取。
## vm.$gl.bus
- **类型**：`object`

- **详细**：

  事件总线，用于框架下各组件之间消息交互，本质上是通过共享vue实例的事件管理来实现。
  ``` javascript
  vm.$el.bus.$on('test', function (msg) {
    console.log(msg)
  })
  vm.$el.bus.$emit('test', 'hi')
  // => "hi"
  ```
## vm.$gl.api
- **类型**：`object`

- **详细**：

  与服务端进行数据交互的接口，包括了CRUD操作，元数据信息加载等。

<<< @/packages/Api.js

## vm.$gl.utils

- **类型**：`object`

- **详细**：

  常用工具方法集。

<<< @/packages/utils.js

## vm.$gl.ui

### vm.$gl.ui.pages
- **类型**：`object`

- **详细**：
  存储放当前加载的页面，key为页面的gid，存放的页面销毁时，会自动从ui.pages中移除。

### vm.$gl.ui.openModal()

ui组件的相关方法，如打开模态窗口。

- **参数**：
  - `{object} [opener]` 打开页面的源vue
  - `{object} [modalConfig]` 模态窗口的配置信息

- **返回值**：`gl-modal` 实例

- **用法**：
  见`gl-modal` 组件说明。


## vm.$gl.ctx
- **类型**：`object`

- **详细**

    当前上下文的变量。在组件属性配置时，有时需采用一些字符值变量，目前支持的变量如下。
     - **${platform}：当前平台的变量**


     - **${app}：当前应用的变量**<br>
        ${app.appId}
        ${app.appBaseUrl}：应用上下文地址如：http://localhost:8080
        ${app.appName}
        ${app.appCode}
        ${app.appKey}
        ${app.appToken}
        ${app.appStatus}
     - **${page}：当前页面的变量**<br>
         ${page.pageId}：页面id<br>
         ${page.pageTitle}<br>
         ${page.appId}<br>
         ${page.appCode}<br>
         ${page.treeNodeId}<br>
         注意，一个页面可能引用其它页面，page代表的是主页面，引用页面\
         ${page.refs[pageid]}
     - **${component}：当前组件的变量**
     - **${control}：当前控件**

      // 正下文环境值
      js:ctx.app.appName
      js:ctx.user.xxx
      js:ctx.page.appName
      js:ctx.platform.locale // 获取当前页面的本地语言环境 ( 'zh_CN' or 'en_US' )。
      js:ctx.platform.device // 获取当前页面的所在的设备环境 ('PC' or 'MOBILE')。
      // 正下文实例值
      js:ctx.tree.dataRef
      js:ctx.form.xxx xxx为字段gid
      js:ctx.table.currentRow
      js:ctx.table.currentQuery
      // 正下文当前实例变量
      js:ctx.vars.xxx  当前组件的变量

      // 方法
      js:fn.setVal()
      js:fn.hasPermission()
    变量的层次关系：
    ${component.$parent}

    <br>

    在各组件的设计器中，可以使用公共变量

