import FormExample from '../../Form/Base/Example'
import FormData from '../../Form/Base/data'

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
        {field: 'active1', title: '单位', cop: 'eq', type: 'string', default: ''},
        {field: 'active2', title: '学历', cop: 'eq', type: 'string', default: ''},
        {field: 'active3', title: '岗位', cop: 'eq', type: 'string', default: ''},
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
    actions: [
      {
        title: '创建-静态组件',
        icon: 'plus',
        color: 'primary',
        // show: true,
        click: 'modal',
        modal: {
          title: '编辑用户信息',
          width: '1200px',
          height: '480px',
          okText: '保存',
          cancelText: '取消',
          body: {
            type: 'staticPage',
            component: FormExample,
            // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
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
        title: '创建-动态组件',
        icon: 'plus',
        color: 'primary',
        // show: true,
        click: 'modal',
        modal: {
          title: '编辑用户信息',
          width: '1200px',
          height: '480px',
          okText: '保存',
          cancelText: '取消',
          body: {
            type: 'dynamicPage',
            component: 'pageCodeXX',
            // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
            opts: FormData
          }
        }
      },
      {
        title: '删除',
        icon: 'delete',
        color: 'danger',
        // show 默认值为 true
        show: 'gs:$ctx.selectedRowKeys.length > 0',
        click: 'delete',
        confirm: '确定删除？',
        // meta 存扩展信息，可为任何值，具体在ui组件中求解、处理。如，在table组件中batch表示批量操作
        meta: 'batch'
      }
      // // 弹出页面提示导出多少条记录
      // {title: '导出EXCEL', click: 'xls'},
      // // 弹出页面提示导出多少条记录
      // {title: '导出PDF', click: 'pdf'},
      // // 默认打印当前列表，若print需要特殊的内容，可以用自定义javascrpt:;来实现
      // {title: '打印', click: 'print'}
    ],
    css: {align: 'right'}
  },
  info: '',
  table: {
    // select: {field: 'id', title: '', type: 'checkbox'},
    rowAction: {
      actions: [
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
      {title: '手机', dataIndex: 'mobilePhone'},
      {title: '性别', dataIndex: 'sex', sorter: true, customRender: (text) => text === 0 ? '男' : '女'},
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
