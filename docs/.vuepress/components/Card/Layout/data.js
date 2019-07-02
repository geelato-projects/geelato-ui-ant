import formData from '../../Form/Base/data.js'
import tableData from '../../Table/Base/data.js'
import treeData from '../../Tree/Base/data.js'


export default {
  cardMap: {
    table1: {
      id: 'table1',
      title: '这是一个列表Card',
      actions: [{title: '更多'}],
      bordered: true,
      style: '',
      type: 'gl-table',
      opts: tableData,
      // 权限描述符
      permission: 'table1'
    },
    form1: {
      id: 'form1',
      title: '这是一个表单Card',
      type: 'gl-form',
      opts: {opts: formData}
    },
    tree1: {
      id: 'tree1',
      title: '这是一个树Card',
      type: 'gl-tree',
      opts: treeData
    },
    list1: {
      id: 'tree1',
      title: '这是一个列表Card',
      type: 'a-list',
      opts: [
        {
          "gender": "male",
          "name": {"title": "mr", "first": "aldaír", "last": "lima"},
          "email": "aldaír.lima@example.com",
          "nat": "BR"
        }, {
          "gender": "female",
          "name": {"title": "mrs", "first": "ella", "last": "gagnon"},
          "email": "ella.gagnon@example.com",
          "nat": "CA"
        }, {
          "gender": "male",
          "name": {"title": "mr", "first": "jörgen", "last": "seewald"},
          "email": "jörgen.seewald@example.com",
          "nat": "DE"
        }, {
          "gender": "female",
          "name": {"title": "miss", "first": "molly", "last": "wilson"},
          "email": "molly.wilson@example.com",
          "nat": "NZ"
        }, {
          "gender": "male",
          "name": {"title": "mr", "first": "jean", "last": "olivier"},
          "email": "jean.olivier@example.com",
          "nat": "FR"
        }]
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
          {span: 6, offset: 0, card: 'tree1'},
          {span: 18, offset: 0, card: 'form1'}
        ]
      }, {
        gutter: 10,
        cols: [
          {span: 8, offset: 0, card: 'list1'},
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
