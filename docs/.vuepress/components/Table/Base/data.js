import FormData from '../../Form/Base/UserFormData'

export default {
  title: '用户信息',
  entity: 'platform_user',
  query: {
    // 是否隐藏整个查询区域
    show: true,
    // null或''表示不展示tree过滤区域
    tree: null,
    // null或''表示不展示常用过滤器区域
    filter: null,
    // null或''表示不展示综合查询区域
    mix: {
      fields: [
        {field: 'name', title: '名称', cop: 'eq', type: 'string'},
        {field: 'loginName', title: '账号', cop: 'contains', type: 'string', lop: 'or', placeholder: '登录名'},
        {field: 'description', title: '描述', cop: 'contains', type: 'string', lop: 'and'},
        {field: 'active', title: '激活', cop: 'eq', type: 'boolean', default: true},
        {
          field: 'birthday',
          title: '生日',
          cop: 'gte',
          type: 'date',
          control: 'range-picker',
          placeholder: ['生日开始日期', '生日结束日期'],
          format: 'yyyy-mm-dd'
        }
        // {
        //   field: 'sex',
        //   title: '性别',
        //   cop: 'eq',
        //   type: 'select',
        //   default: 'male',
        //   options: [{key: '男', value: 'male'}, {key: '女', value: 'female'}]
        // }
      ],
      // 取值 1~4、6
      fieldPerRow: 4
    }
  },
  toolbar: {
    actions: [{
      text: '创建',
      icon: 'plus',
      type: 'primary',
      fn: 'openModal',
      // opener、content、modal、handler，默认为handler
      ctx: 'this',
      params: {
        title: '编辑用户信息',
        width: '1200px',
        height: '480px',
        body: {
          type: 'staticPage',
          component: 'GlMagicForm',
          // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
          props: {opts: JSON.parse(JSON.stringify(FormData))}
        },
        actions: [{
          text: '保存',
          type: 'primary',
          fn: 'save',
          // opener、content、modal，默认为content
          ctx: 'content',
          params: {},
          then: {
            fn: 'close',
            ctx: 'modal',
            then: {
              fn: 'refresh',
              ctx: 'opener'
            }
          }
        }, {
          fn: 'close',
          text: '取消',
          ctx: 'modal'
        }]
      }
    }],
    css: {align: 'right'}
  },
  info: '',
  table: {
    // select: {field: 'id', title: '', type: 'checkbox'},
    rowAction: {
      actions: [{
        text: '修改',
        icon: 'plus',
        type: 'primary',
        fn: 'openModal',
        // opener、content、modal、handler，默认为handler
        ctx: 'this',
        params: {
          title: '编辑用户信息',
          width: '1200px',
          height: '480px',
          body: {
            type: 'staticPage',
            component: 'GlMagicForm',
            // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
            props: {opts: JSON.parse(JSON.stringify(FormData))}
          },
          actions: [{
            text: '保存',
            type: 'primary',
            fn: 'save',
            // opener、content、modal，默认为content
            ctx: 'content',
            params: {},
            then: {
              fn: 'close',
              ctx: 'modal',
              then: {
                fn: 'refresh',
                ctx: 'opener'
              }
            }
          }, {
            fn: 'close',
            text: '取消',
            ctx: 'modal'
          }]
        }
      }],
      actions2: [
        {
          title: '修改',
          click: 'modal',
          modal: {
            title: '编辑用户信息',
            width: '1000px',
            height: '480px',
            okText: '',
            cancelText: '',
            body: {
              type: 'staticPage',
              component: '/docs/.vuepress/components/Form/Base/Example.vue',
              opts: {
                ui: {
                  entityName: 'platform_user',
                  fields: 'id,name,loginName,description',
                  layout: [
                    [{loginName: [4, 8]}, {name: [4, 8]}],
                    [{description: [4, 20]}]
                  ],
                  model: {id: '@.id'}
                }
              }
            }
          }
        },
        {
          title: '详细',
          click: 'modal',
          modal: {
            type: 'page',
            value: 'platform_user_list_detail',
            opts: {}
          }
        },
        {
          title: '详细3',
          click: 'modal',
          modal: {
            type: 'page',
            value: 'platform_user_list_detail',
            opts: {}
          }
        }
      ]
    },
    columns: [
      {title: '#', dataIndex: 'id', scopedSlots: {customRender: 'serial'}},
      {title: '名称', dataIndex: 'name', sorter: true},
      {title: '登录名', dataIndex: 'loginName', sorter: true},
      {title: '电话', dataIndex: 'telephone'},
      {title: '性别', dataIndex: 'sex', sorter: true, customRender: (text) => text === 2 ? '保密' : (text === 1 ? '男':'女')},
      {title: '邮箱', dataIndex: 'email'},
      {title: '次序', dataIndex: 'seq', needTotal: true},
      {title: '描述', dataIndex: 'description'},
      // {
      //   title: '服务调用次数',
      //   dataIndex: 'callNo',
      //   sorter: true,
      //   needTotal: true,
      //   customRender: (text) => text + ' 次'
      // },
      // {
      //   title: '状态',
      //   dataIndex: 'status',
      //   needTotal: true
      // },
      // {
      //   title: '更新时间',
      //   dataIndex: 'updatedAt',
      //   sorter: true
      // },
      {
        title: '操作',
        dataIndex: '',
        width: '150px',
        scopedSlots: {customRender: 'action'}
      }
    ],
    pageSize: 20,
    order: 'name|+'
  },
  stat: ''
}
