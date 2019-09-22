import FormData from '../../Form/Base/UserFormData'

export default {
  title: '系统消息',
  entity: 'platform_message',
  query: {
    mix: {
      fields: [
        {field: 'title', title: '标题', cop: 'contains', type: 'string', control: 'input'},
        {field: 'type', title: '类型', cop: 'eq', type: 'select', data: [{ss:''}], ds: {}},
        {
          field: 'createAt',
          title: '提醒时间',
          cop: 'between',
          type: 'date',
          control: 'range-picker',
          lop: 'or',
          placeholder: '登录名'
        }
      ],
      // 取值 1~4、6
      fieldPerRow: 4
    }
  },
  toolbar: {},
  info: '',
  table: {
    // select: {field: 'id', title: '', type: 'checkbox'},
    rowAction: {
      actions: [{
        text: '删除',
        icon: 'delete',
        type: 'primary',
        fn: 'delete',
        ctx: 'this',
        params: {}
      }]
    },
    columns: [
      {title: '#', dataIndex: 'id', scopedSlots: {customRender: 'serial'}},
      {title: '标题', dataIndex: 'title', sorter: true},
      {title: '类型', dataIndex: 'type', sorter: true},
      {title: '创建时间', dataIndex: 'createAt', sorter: true},
      {
        title: '操作',
        dataIndex: '',
        width: '150px',
        scopedSlots: {customRender: 'action'}
      }
    ],
    pageSize: 20,
    order: 'title|+'
  },
  stat: ''
}
