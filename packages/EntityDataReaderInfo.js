export default class EntityDataReaderInfo {

  /**
   * @param entity 实体名称
   * @param lazy 是否懒加载，默认为是
   * @param fields e.g. 'name,code'
   * @param params e.g. [{name:'provinceCode',cop:'eq',value:'gs:$ctx.form.province'}]，该信息会自动加入计算属性中，当province的值变动时，该数据源会重新加载计算
   * @param resultMapping 查询返回结果字段的转换映射
   * @param description
   */
  constructor({entity, fields, params = [], lazy = true, withMeta = false, pageNo, pageSize, order, resultMapping = {}, description} = {}) {
    // 实体数据源
    this.clazz = 'EntityDataReaderInfo'
    // 实体编码
    this.entity = entity
    this.fields = fields
    // 带参数查询的数据源
    this.params = params
    this.lazy = lazy
    this.pageNo = pageNo
    this.pageSize = pageSize
    this.order = order
    // 查询结果是否返回元数据（schema）
    this.withMeta = withMeta
    this.resultMapping = resultMapping
    this.description = description
  }
}
