export default {
  bind: {
    opts: {
      tree: [{
        gid: 1,
        title:'数据库连接',
        dsName: 'platform_dev_db_connect',
        children: [
          {
            gid: 12,
            title:'数据表',
            data: [
              {title: '数据表', key: '1099255145619690408'}
            ],
            isLeaf: false,
            children:[
              {
                gid: 222,
                title:'xxx',
                dsName: 'platform_dev_table',
                isLeaf: false,
                children: [
                  {
                    gid: 121,
                    title:'数据列',
                    dsName: 'platform_dev_column',
                    isLeaf: true
                  }
                ]
              }
            ],
          },
          {
            gid: 11,
            title:'组织用户',
            data: [
              {title: '用户', key: '1099255145619690407'}
            ],
            isLeaf: false,
            children: [
              {
                gid: 111,
                title:'用户',
                dsName: 'platform_user',
                isLeaf: true,
                defaultExpandIndex: 0
              }
            ]
          }
        ]
      }],
      "ds": {
        "platform_dev_db_connect": {
          "lazy": false,
          "resultMapping": {"title": "dbName", "key": "id"},
          "fields": "dbName,id",
          "params": {},
          "entity": "platform_dev_db_connect"
        },
        "platform_dev_table": {
          "lazy": false,
          "resultMapping": {"title": "tableName", "key": "id"},
          "fields": "tableName,id",
          "params": [{name: 'connectId', value: '$ctx.$parent.dataRef.key'}],
          "order": "tableName|+",
          "entity": "platform_dev_table"
        },
        "platform_dev_column": {
          "lazy": false,
          "resultMapping": {"title": "name", "key": "id"},
          "fields": "name,id",
          "params": [{name: 'tableId', value: '$ctx.dataRef.key'}],
          "order": "name|+",
          "entity": "platform_dev_column"
        },
        "platform_user": {
          "lazy": false,
          "resultMapping": {"title": "name", "key": "id"},
          "fields": "name,id",
          "params": {},
          "entity": "platform_user"
        }
      },
      // treeData: [{
      //   title: 'CRM',
      //   key: '0-0',
      //   slots: {
      //     icon: 'smile',
      //   },
      //   children: [
      //     {
      //       title: '客户信息', key: '0-0-0', slots: {icon: 'meh', title: 'adfasdf'}, children: [
      //         {title: '基础信息', key: '0-0-0-1', xtype: 'file', scopedSlots: {icon: 'custom'}},
      //         {title: '地址信息', key: '0-0-0-2', xtype: 'file', scopedSlots: {icon: 'custom'}}
      //       ], glMeta: {type: 'platform_dev_db_connect'}
      //     },
      //     {title: '订单信息', key: '0-0-1', scopedSlots: {icon: 'custom'}}],
      //   glMeta: {type: 'platform_dev_db_connect'}
      // }],
      showLine: true,
      showIcon: true,
      checkable: false,
      draggable: true,
      menuAction: {
        actions: [
          {
            "title": "新建目录",
            "icon": "folder",
            "type": "primary",
            "control": "link",
            "ctx": "this",
            "params": {},
            "gid": "ebo4jfXi"
          },
          {
            gid: 'ebo4jf3i',
            title: '新建页面',
            icon: 'file',
          },
          {
            gid: 'ebo4jf32',
            title: '新建接口',
            icon: 'api',
          },
          {
            gid: 'rro4jf3i',
            title: '重命名',
            icon: 'edit',
          },
          {
            gid: 'ebooif3i',
            title: '删除',
            icon: 'delete',
          }
        ],
      },
      nodeAction: {
        actions: [{gid: 'SEIDKQE9', title: '节点按钮'}]
      }
    },
    params: {}
  }
}
