export default {
  type: 'object',
  // 表单可绑定多实体，这是默认第一实体
  defaultEntity: 'platform_user',
  // update|create|read
  state: 'save',
  properties: {
    // 设置该id:{}，便于子实体中依赖该id
    id: {},
    password: {
      control: 'password',
      title: '账户密码',
      tips: '至少6位',
      rules: {
        required: true,
        min: 6
      },
      // control 的属性信息，参考对应的vue.ant.design的设置
      props: {}
    },
    confirmPassword: {
      control: 'password',
      title: '确认密码',
      rules: {
        required: true,
        min: 6,
        confirmed: 'password'
      },
      // 持久化到服务端时，忽略该字段
      isServerSaveIgnore: true
    },
    tel: {
      control: 'input',
      title: '密保手机',
      // 如果实体的字段名称与tel不一样，或因多实体都存在tel字段，可通过field指定，field未设置时，field:'tel'
      field: 'telephone',
      // 若字段需绑定其它实体，该通过该属性设置
      entity: 'platform_user',
      rules: {
        required: true,
        numeric: true,
        //08613912345678
        max: 14
      },
      props: {
        placeholder: '电话号码'
      }
    },
    mfa: {
      control: 'input',
      title: 'MFA 设备',
      tips: '',
      rules: {
        required: false
      },
      // 持久化到服务端时，忽略该字段
      isServerSaveIgnore: true
    }
  },
  layout: {
    type: 'table',
    rows: [{
      cols: [
        {span: 4, label: true, field: 'password'}, {span: 8, field: 'password'},
        {span: 4, label: true, field: 'confirmPassword'}, {span: 8, field: 'confirmPassword'}
      ]
    }, {
      cols: [
        {span: 4, label: true, field: 'tel'}, {span: 20, field: 'tel'}
      ]
    }, {
      cols: [
        {span: 4, label: true, field: 'mfa'}, {span: 20, field: 'mfa'}
      ]
    }],
    hidden: {
      // 各表单状态，需隐藏的内容
      common: {},
      update: {},
      create: {},
      read: {}
    }
  },
  ds: {},
  vars: {},
  watch: {}
}
