/**
 *  默认值有几个属性可以配置，取值的优先顺序是 value > props.defaultValue > props.defaultActiveIndex，按顺序，取到值为止
 */
export default {
  // 16位 global id，不采用32位uuid
  gid: 'asdfghjkloiuyx16',
  // 绑定的字段名，如name、age、description，用于实体绑定
  field: 'telephone',
  // 绑定的字段名，当用于form组件时，默认采用form绑定的实体，若字段需绑定其它实体，该通过该属性设置
  entity: 'platform_user',
  // 控件类型，建议首字母大写，默认会被转成首字母大写
  control: 'Password',
  // 标题，对应label
  title: '密码',
  // 提示信息，鼠标移动到字段前方的信息图标上时展示
  tips: '至少6位',
  // 控件值，初始时采用的值，过程中更改后的值
  value: '',
  // 数据源（预初始），常用于下拉选择等选择取类控件，text相当于label
  data: [{text: '默认', value: 0}, {text: '类型一', value: 1}, {text: '类型二', value: 2}],
  // 数据源（动态，通过数据服务获取），这里为数据源的名称
  dsName: 'province',
  // 只读
  readOnly: true,
  // 验证规则，可多条规则并存，详见规则验证
  rules: {
    required: true,
    // 确认字段
    confirmed: 'password',
    min: 6,
    // 指定输入格式、类型
    email: true,
    numeric: true,
    // 扩展的唯一约束
    unique: {
      entityReader: {
        entity: 'platform_user',
        // default false
        lazy: false,
        // 支持字段重命名
        fields: 'loginName',
        params: [{
          name: 'loginName',
          cop: 'eq',
          value: '$ctx.loginName'
        }],
      }
    }
  },
  // 控件的属性
  props: {
    // 用于输入类控件的提示信息，提示会在输入字段为空时显示
    placeholder: 'xxx@xxx.xxx',
    // 默认值，初始化时使用
    defaultValue: 0,
    // 默认选中项
    defaultActiveIndex: 1
  },
  // 自定义样式
  style: {},
  // 自定义样式类
  class: {},
  // 服务端保存时，是否忽略该字段
  isServerSaveIgnore: true,
}
