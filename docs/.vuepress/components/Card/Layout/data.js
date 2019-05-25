import formData from '../../Form/Base/data.js'
import tableData from '../../Table/Base/data.js'


export default {
  cardMap: {
    table1: {
      id: 'table1',
      title: '这是一个列表Card',
      actions: [{title: '更多'}],
      bordered: true,
      style: '',
      type: 'gl-table',
      opts: tableData.opts,
      // 权限描述符
      permission: 'table1'
    },
    form1: {
      id: 'form1',
      title: '这是一个表单Card',
      type: 'gl-form',
      opts: formData
    }
  },
  layout: {
    title: 'xxx',
    rows: [
      {
        gutter: 10,
        cols: [
          {span: 24, offset: 0, card: 'form1'}
        ]
      },
      {
        gutter: 10,
        cols: [
          {span: 24, offset: 0, card: 'table1'}
        ]
      },
      {
        gutter: 10,
        cols: [
          {span: 8, offset: 0, card: 'form1'},
          {span: 16, offset: 0, card: 'table1'},
          {
            span: 8, offset: 0, rows: [{
              gutter: 10, cols: [{span: 8, offset: 0, card: 'form1'}]
            }, {
              gutter: 10, cols: [{span: 12, offset: 0, card: 'table1'}]
            }]
          }
        ]
      }, {
        gutter: 10,
        cols: [
          {span: 8, offset: 0, card: 'form1'},
          {span: 16, offset: 0, card: 'table1'},
          {
            span: 8, offset: 0, rows: [{
              gutter: 10, cols: [{span: 8, offset: 0}, {span: 12, offset: 0}]
            }]
          }
        ]
      }]
  },
  hidden: {
    // 各表单状态，需隐藏的内容
    common: {
      table1: 'auth:$ctx.cards.table1"',
      table2: 'gs:$ctx.form.type!=="typeB"',
      form1: 'gs:$ctx.form.type!=="typeC"'
    },
    update: {},
    create: {},
    read: {}
  },
  vars: {
    myVarA: {
      description: '这是一个变量，变量名字为myVarA，值为30',
      value: '30'
    }
  }
}
