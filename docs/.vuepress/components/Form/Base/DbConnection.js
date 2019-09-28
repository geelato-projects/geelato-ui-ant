export default {
  type: 'object',
  // 表单可绑定多实体，这是默认第一实体
  defaultEntity: 'platform_dev_db_connect',
  // update|create|read
  state: 'save',
  properties: {
    // 设置该id:{}，便于子实体中依赖该id
    id: {},
    dbConnectName: {
      control: 'input',
      title: '连接名称',
      tips: '',
      rules: {
        required: true
      }
    },
    dbName: {
      control: 'input',
      title: '数据库名',
      tips: '',
      rules: {
        required: true
      }
    },
    dbSchema: {
      control: 'input',
      title: '数据库schema',
      tips: '',
      rules: {
        required: true
      }
    },
    dbType: {
      control: 'select',
      title: '类型',
      data: [
        {text: 'MySql', value: 'MySql'},
        {text: 'Oracle', value: 'Oracle'},
        {text: 'MSSql', value: 'MSSql'}
      ],
      props: {
        defaultValue: 'MySql'
      }
    },
    dbPassword: {
      control: 'password',
      title: '账户密码',
      tips: '',
      rules: {
        required: true
      }
    },
    dbUserName: {
      control: 'input',
      title: '账户名',
      tips: '',
      rules: {
        required: true
      }
    },
    dbPort: {
      control: 'input',
      title: '连接端口',
      tips: '',
      rules: {
        required: true
      }
    },
    dbHostnameIp: {
      control: 'input',
      title: '主机名或IP',
      tips: '',
      rules: {
        required: true
      }
    },
    enable: {
      control: 'checkbox',
      field: 'checkState',
      title: '启用',
      // 采用1、0来代替true、false
      value: 1
    },
    // description: {
    //   control: 'textarea',
    //   title: '实体描述'
    // }
  },
  layout: {
    type: 'table',
    rows: [{
      cols: [
        {span: 4, label: true, field: 'dbConnectName'}, {span: 8, field: 'dbConnectName'},
        {span: 4, label: true, field: 'dbName'}, {span: 8, field: 'dbName'}
      ]
    }, {
      cols: [
        {span: 4, label: true, field: 'dbSchema'}, {span: 8, field: 'dbSchema'},
        {span: 4, label: true, field: 'dbType'}, {span: 8, field: 'dbType'}
      ]
    }, {
      cols: [
        {span: 8, label: true, field: 'dbUserName'}, {span: 16, field: 'dbUserName'},
        {span: 8, label: true, field: 'dbPassword'}, {span: 16, field: 'dbPassword'}
      ]
    }, {
      cols: [
        {span: 8, label: true, field: 'dbHostnameIp'}, {span: 16, field: 'dbHostnameIp'},
        {span: 8, label: true, field: 'dbPort'}, {span: 16, field: 'dbPort'}
      ]
    }],
    hidden: {}
  },
  ds: {},
  vars: {},
  watch: {}
}
