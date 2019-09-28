import DbConnectionFormData from "../../Form/Base/DbConnection";
import EntityFormData from "../../Form/Base/Entity";
import tableData from "../../Table/meta/table";

let listGroupEntityDataReader = {
  entity: 'platform_dev_db_connect',
  fields: 'id,dbConnectName',
  withMeta: false,
  resultMapping: {
    avatarUrl: `'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'`,
    title: `$ctx.dbConnectName`
  }
}


let listEntityDataReader = {
  entity: 'platform_dev_table',
  fields: 'id,connectId,title,tableName,tableType,tableComment',
  withMeta: false,
  resultMapping: {
    // avatarUrl: `'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png'`,
    title: `$ctx.tableName +'('+ $ctx.title + ')'`,
    tips: 'tableComment'
  }
}

let plus = {
  cardMap: {
    form1: {
      id: 'form1',
      title: '详细信息',
      actions: [{title: '更多'}],
      bordered: false,
      style: 'margin-top: 0px',
      content: {
        type: 'static',
        component: 'GlTable',
        // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
        props: {opts: JSON.parse(JSON.stringify(tableData))}
      }
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
      }
    ]
  }
}

export default {
  listTitle: '实体与视图列表',
  listAction: {
    title: '操作',
    actions: [{
      text: '添加数据库连接',
      icon: 'plus',
      type: 'primary',
      fn: 'openModal',
      // opener、content、modal、handler，默认为handler
      ctx: 'this',
      params: {
        title: '编辑数据库连接信息',
        width: '1200px',
        height: '480px',
        body: {
          type: 'staticPage',
          component: 'GlForm',
          props: {opts: JSON.parse(JSON.stringify(DbConnectionFormData))},
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
      },
      // 输入数据的转换
      dataMapping: {
        query: {tableSchema: '$ctx.code'}
      }
    }, {
      fn: 'refresh',
      text: '刷新列表',
      ctx: 'self'
    }]
  },
  listSearch: {placeholder: '查询实体、视图'},
  listGroupIcon: {type: "database", theme: "twoTone", twoToneColor: "#52c41a"},
  listGroupItemAction: {
    title: '',
    actions: [
      {
        text: '添加实体',
        icon: 'plus',
        type: 'primary',
        fn: 'openModal',
        // opener、content、modal、handler，默认为handler
        ctx: 'this',
        params: {
          title: '编辑实体信息',
          width: '1200px',
          height: '480px',
          body: {
            type: 'staticPage',
            component: 'GlForm',
            // component: resolve => require(['/components/Form/Base/Example.vue'], resolve),
            props: {opts: JSON.parse(JSON.stringify(EntityFormData))},
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
        },
        // 输入数据的转换
        dataMapping: {
          query: {connectId: '$ctx.id'}
        }
      }, {
        text: '编辑数据库连接',
        icon: 'plus',
        type: 'primary',
        fn: 'openModal',
        // opener、content、modal、handler，默认为handler
        ctx: 'this',
        params: {
          title: '编辑数据库连接信息',
          width: '1200px',
          height: '480px',
          body: {
            type: 'staticPage',
            component: 'GlForm',
            props: {opts: JSON.parse(JSON.stringify(DbConnectionFormData))},
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
        },
        // 输入数据的转换
        dataMapping: {
          query: {id: '$ctx.id'}
        }
      }, {
        fn: 'delete',
        text: '删除数据库连接',
        ctx: 'self'
      }]
  },
  listGroupEntityDataReader: listGroupEntityDataReader,
  listEntityDataReader: listEntityDataReader,
  plusTitle: '详细信息',
  plusPage: plus
}
