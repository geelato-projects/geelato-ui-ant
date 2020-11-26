export default {
  properties: [
    {control: 'Input', title: '输入框'},
    {control: 'InputNumber', title: '数字输入框'},
    {control: 'Textarea', title: '多行文本输入框'},
    {control: 'Password', title: '确认密码'},
    {control: 'Switch', title: '确认密码'},
    {control: 'Checkbox', title: '复选框（单个）'},
    {control: 'button', title: '按钮', icon: 'right', iconFirst: false},
    {control: 'link', title: '链接', icon: 'link', iconFirst: true},
    {
      control: 'CheckboxGroup',
      title: '复选框（多个）',
      data: [{text: 'A', value: 1}, {text: 'B', value: 2}, {text: 'C', value: 3}],
      props: {defaultActiveIndex: 1}
    },
    {
      control: 'Radio',
      title: '单选',
      data: [{text: 'A', value: 1}, {text: 'B', value: 2}, {text: 'C', value: 3}],
      props: {defaultActiveIndex: 1}
    },
    {
      control: 'RadioButton',
      title: '单选按钮',
      data: [{text: 'A', value: 1}, {text: 'B', value: 2}, {text: 'C', value: 3}],
      props: {defaultActiveIndex: 1}
    },
    {control: 'DatePicker', title: '确认密码'},
    {control: 'TimePicker', title: '确认密码'},

  ]
}
