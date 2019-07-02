export default {
  entityDataSource: {
    entityName: 'platform_role',
    fieldNames: 'id,name,code,description',
    withMeta: false,
    // key为组件内用到的字段名，右边为实体查询结果返回的字段
    // 当右边的字段不在fieldNames的范围内时，则该值为静态值，如以下的avatarUrl
    resultMapping: {
      avatarUrl: `'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'`,
      title: `$ctx.name +'('+ $ctx.code + ')'`,
      content: 'code',
      description: 'description'
    }
  }
}
