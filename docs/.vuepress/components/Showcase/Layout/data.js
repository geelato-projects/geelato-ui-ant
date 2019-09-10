import formData from '../../Form/Base/UserFormData.js'
import tableData from '../../Table/Base/data.js'


export default {
  cardMap: {
    table1: {
      id: 'table1',
      title: '这是一个列表Card',
      type: 'gl-table',
      opts: tableData.opts
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
              gutter: 10, cols: [{span: 8, offset: 0, card: 'form11'}]
            }, {
              gutter: 10, cols: [{span: 12, offset: 0, card: 'table11'}]
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
  }
}
