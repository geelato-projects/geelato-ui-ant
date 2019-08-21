# vm.$gl
在vue的实体属性的基础上，增加了本UI框架的属性$gl，提供接口服务、工具方法等。
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
- **类型**：`object`

- **详细**：

  ui组件的相关方法，如打开模态窗口。
### vm.$gl.ui.openModal()

- **参数**：
  - `{object} [opener]` 打开页面的源vue
  - `{object} [modalConfig]` 模态窗口的配置信息

- **返回值**：`gl-modal` 实例

- **用法**：
  见`gl-modal` 组件说明。
