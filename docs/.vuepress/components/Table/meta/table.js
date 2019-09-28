import FormData from '../../Form/Base/meta'

export default {
  title: '用户信息',
  entity: 'platform_dev_column',
  query: {
    mix: {
      properties: [
        // {
        //   field: 'title',
        //   title: '名称',
        //   cop: 'eq',
        //   control: 'input',
        //   lop: 'and',
        //   props: {placeholder: '中文名称', defaultValue: ''}
        // },
        {field: 'columnName', title: '列名', cop: 'contains', control: 'input', lop: 'and', props: {placeholder: ''}},
        {field: 'linked', title: '是否已同步', cop: 'eq', control: 'checkbox', props: {defaultValue: 1}},
      ],
      layout: {
        display: 'auto',
        // 取值 1~4、6
        fieldPerRow: 3
      }
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
          component: 'GlForm',
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
    }, {
      text: '同步到数据库',
      icon: 'swap-right',
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
          component: 'GlForm',
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
  alert: null,
  showPagination: 'true',
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
            component: 'GlForm',
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
      }]
    },
    columns: [
      {title: '#', dataIndex: 'id', scopedSlots: {customRender: 'serial'}},
      {title: '名称', dataIndex: 'title', sorter: true},
      {title: '列名', dataIndex: 'name', sorter: true},
      {title: '数据类型', dataIndex: 'dataType'},
      {
        title: '链接',
        dataIndex: 'linked',
        sorter: true,
        customRender: (text) => text === 2 ? '保密' : (text === 1 ? '男' : '女')
      },
      {title: '次序', dataIndex: 'seq', needTotal: true},
      {
        title: '更新时间',
        dataIndex: 'updateAt',
        sorter: true
      },
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
