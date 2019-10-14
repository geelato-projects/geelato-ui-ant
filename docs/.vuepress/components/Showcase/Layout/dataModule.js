import FormData from "../../Form/Base/data";

export default {
  opts: {
    rightTitle: '模块列表',
    entity: 'platform_module',
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
          {field: 'title', title: '名称', cop: 'contains', type: 'string', lop: 'or'},
          {field: 'code', title: '编码', cop: 'contains', type: 'string', lop: 'or'},
          {field: 'description', title: '描述', cop: 'contains', type: 'string', lop: 'or'}
        ]
      }
    },
    toolbar: {
      title: '',
      actions: [
        {
          title: '创建',
          color: "primary",
          click: 'modal',
          modal: {
            title: '模块信息',
            type: 'staticPage',
            value: '/components/gl-form-combination/Index.vue',
            opts: formConfig.opts
          }
        },
        {title: '删除', color: "primary", click: 'deleteMulti', confirm: '确定删除？'}
      ],
      dropdown: {
        title: '',
        actions: [
          {
            title: '创建',
            click: 'modal',
            modal: {
              title: '模块信息',
              type: 'staticPage',
              value: '/components/gl-form-combination/Index.vue',
              opts: formConfig.opts
            }
          },
          {title: '删除', click: 'deleteMulti', confirm: '确定删除？'}
          // // 弹出页面提示导出多少条记录
          // {title: '导出EXCEL', click: 'xls'},
          // // 弹出页面提示导出多少条记录
          // {title: '导出PDF', click: 'pdf'},
          // // 默认打印当前列表，若print需要特殊的内容，可以用自定义javascrpt:;来实现
          // {title: '打印', click: 'print'}
        ]
      }
    },
    tips: {
      html: '模块的名称，即为平台顶级菜单模块的名称。'
    },
    table: {
      select: {field: 'id', title: '', type: 'checkbox'},
      dropdown: {
        title: '操作',
        actions: [
          // {
          //   title: '修改',
          //   click: 'modal',
          //   modal: {
          //     title: '模块信息',
          //     type: 'staticPage',
          //     value: '/components/gl-form-simple/Index.vue',
          //     opts: {
          //       ui: {
          //         entityName: 'platform_module',
          //         fields: 'id,title,code,index,resize,html,description',
          //         layout: [
          //           [{title: [4, 8]}, {code: [4, 8]}],
          //           [{index: [4, 8]}, {resize: [4, 8]}],
          //           [{html: [4, 20]}],
          //           [{description: [4, 20]}]
          //         ],
          //         model: {id: '@.id'}
          //       }
          //     }
          //   }
          // },
          // {
          //   title: '详情',
          //   click: 'modal',
          //   modal: {
          //     title: '详细信息',
          //     type: 'staticPage',
          //     value: '/views/platform-core/settings/module/Detail.vue',
          //     opts: {
          //       ui: {
          //         model: {id: '@.id'}
          //       }
          //     }
          //   }
          // },
          // {
          //   title: '详情1',
          //   click: 'modal',
          //   modal: {
          //     title: '详细信息',
          //     type: 'staticPage',
          //     value: '/components/gl-page-loader/Index.vue',
          //     opts: {
          //       // code: 'list_9V02AlD4',
          //       code: 'form-combination_Ygvv7IXs',
          //       model: {id: '@.id'}
          //     }
          //   }
          // },
          {
            title: '模块信息',
            click: 'modal',
            modal: {
              title: '模块信息',
              type: 'staticPage',
              value: formConfig.component,
              opts: formConfig.opts,
              query: formConfig.query
            }
          },
          {
            title: '菜单信息',
            click: 'modal',
            modal: {
              title: '菜单信息',
              type: 'staticPage',
              value: menuConfig.component,
              opts: menuConfig.opts,
              query: menuConfig.query
            }
          },
          // {
          //   title: '详情',
          //   click: 'modal',
          //   modal: {
          //     title: '详细信息',
          //     type: 'staticPage',
          //     value: detailConfig.component,
          //     opts: detailConfig.opts
          //   }
          // }
        ]
      },
      columns: [
        {field: 'id', title: '', visible: false},
        {field: 'title', title: '名称', type: 'string', format: ''},
        {field: 'code', title: '模块编码', type: 'string', format: ''},
        {field: 'description', title: '描述', type: 'string', format: ''}
      ],
      p: '1,20',
      order: 'title|+'
    },
    stat: ''
  },
  opts2:{
    title: '模块列表',
    entity: 'platform_module',
    query: {
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
        {title: '次序', dataIndex: 'seqNo', needTotal: true},
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
}
