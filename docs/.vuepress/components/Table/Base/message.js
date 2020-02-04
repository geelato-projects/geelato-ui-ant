import FormData from '../../Form/Base/UserFormData'

export default {
  title: '系统消息',
  entity: 'platform_message',
  query: {
    mix: {
      fields: [
        {field: 'title', title: '标题', cop: 'contains', control: 'input'},
        {field: 'content', title: '内容', cop: 'contains', control: 'input'}
      ],
      layout: {
        display: 'auto',
        // 取值 1~4、6
        fieldPerRow: 4
      }
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
      {title: '内容', dataIndex: 'content', sorter: true},
      {title: '发送时间', dataIndex: 'sendTime', sorter: true},
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
