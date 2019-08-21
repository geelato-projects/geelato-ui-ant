# 数据

## entity-data-reader
组件的实体数据源，可声明查询实体字段（列），返回结果字段（列）处理，可用于绑定查询列表、绑定表单实体查询。

### 定义
<<< @/packages/EntityDataReader.js

### 实例
``` javascript

export default {
  entityDataReader: {
    entity: 'platform_role',
    fields: 'id,name,code,description',
    // 查询返回结果是否包括元数据
    withMeta: false,
    // key为组件内用到的字段名，右边为实体查询结果返回的字段
    // 当右边的字段不在fieldNames的范围内时，则该值为静态值，如以下的avatarUrl
    resultMapping: {
      avatarUrl: `'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'`,
      title: `$ctx.name +'('+ $ctx.code + ')'`,
      content: 'code',
      description: 'description'
    },
    pageSize: 20,
    order: 'name|+'
  }
}

```
