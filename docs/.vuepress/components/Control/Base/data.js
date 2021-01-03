import utils from '../../../../../packages/utils/utils.js'

export default {
  properties: [
    {gid: utils.uuid(16), field: utils.uuid(4), control: 'Input', title: '输入框'},
    {
      gid: utils.uuid(16),
      field: utils.uuid(4),
      control: 'Input',
      title: '只读输入框',
      readOnly: true,
      placeholder: '这是只读输入框'
    },
    {gid: utils.uuid(16), field: utils.uuid(4), control: 'InputNumber', title: '数字输入框'},
    {gid: utils.uuid(16), field: utils.uuid(4), control: 'Textarea', title: '多行文本输入框'},
    {gid: utils.uuid(16), field: utils.uuid(4), control: 'Password', title: '确认密码'},
    {gid: utils.uuid(16), field: utils.uuid(4), control: 'Switch', title: '开关'},
    {gid: utils.uuid(16), field: utils.uuid(4), control: 'Checkbox', title: '复选框（单个）'},
    {gid: utils.uuid(16), field: utils.uuid(4), control: 'button', title: '按钮', icon: 'right', iconFirst: false},
    {gid: utils.uuid(16), field: utils.uuid(4), control: 'Link', title: '链接', icon: 'link', iconFirst: true},
    {
      gid: utils.uuid(16),
      field: utils.uuid(4), control: 'CheckboxGroup',
      title: '复选框（多个）',
      // data: [{text: 'A', value: 1}, {text: 'B', value: 2}, {text: 'C', value: 3}],
      data: [
        {text: 'Apple', value: 'Apple'},
        {text: 'Pear', value: 'Pear'},
        {text: 'Orange', value: 'Orange', disabled: true, defaultChecked: true},
      ],
      props: {defaultActiveIndex: 1}
    },
    {
      gid: utils.uuid(16),
      field: utils.uuid(4), control: 'Radio',
      title: '单选',
      data: [{text: 'A', value: 1}, {text: 'B', value: 2}, {text: 'C', value: 3}],
      props: {defaultActiveIndex: 2}
    },
    {
      gid: utils.uuid(16),
      field: utils.uuid(4), control: 'RadioButton',
      title: '单选按钮',
      data: [{text: 'A', value: 1}, {text: 'B', value: 2}, {text: 'C', value: 3}],
      props: {defaultActiveIndex: 1}
    },
    {
      gid: utils.uuid(16), field: utils.uuid(4), control: 'select', title: '下拉选择',
      data: [{text: '默认', value: 0}, {text: '类型一', value: 1}, {text: '类型二', value: 2}],
      props: {
        // defaultValue: 1
        // defaultActiveIndex: 1
      }
    },
    {gid: utils.uuid(16), field: utils.uuid(4), control: 'DatePicker', title: '日期'},
    {gid: utils.uuid(16), field: utils.uuid(4), control: 'TimePicker', title: '时间'},

  ]
}
