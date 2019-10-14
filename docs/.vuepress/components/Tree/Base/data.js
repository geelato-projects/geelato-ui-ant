export default {
  treeEntityName: 'platform_dev_project',
  treeEntityPkField: 'id',
  treeEntityNameField: 'name',
  treeId: 'UIYEHUWIUIYEHUWIUIYEHUWIUIYEHUWI',
  treeName: '测试项目',
  nodeEntityName: 'platform_dev_page',
  nodeEntityPkField: 'id',
  nodeEntityNameField: 'code',
  treeData: [{
    title: 'CRM',
    key: '0-0',
    slots: {
      icon: 'smile',
    },
    children: [
      {
        title: '客户信息', key: '0-0-0', slots: {icon: 'meh'}, children: [
          {title: '基础信息', key: '0-0-0-1', xtype: 'file', scopedSlots: {icon: 'custom'}},
          {title: '地址信息', key: '0-0-0-2', xtype: 'file', scopedSlots: {icon: 'custom'}}
        ]
      },
      {title: '订单信息', key: '0-0-1', scopedSlots: {icon: 'custom'}}],
  }],
  menuItems: [
    {
      label: '新建目录',
      icon: 'folder',
    },
    {
      label: '新建页面',
      icon: 'file',
    },
    {
      label: '新建接口',
      icon: 'api',
    },
    {
      label: '重命名',
      icon: 'edit',
    },
    {
      label: '删除',
      icon: 'delete',
    }
  ]
}
