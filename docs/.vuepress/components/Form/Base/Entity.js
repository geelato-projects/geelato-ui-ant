export default {
  type: 'object',
  // 表单可绑定多实体，这是默认第一实体
  defaultEntity: 'platform_dev_table',
  // update|create|read
  state: 'save',
  properties: {
    // 设置该id:{}，便于子实体中依赖该id
    id: {},
    connectId: {},
    title: {
      control: 'input',
      title: '实体名称',
      rules: {
        required: true
      }
    },
    tableName: {
      control: 'input',
      title: '表名称',
      tips: '数据库中的表名，在创建了表，绑定之后生成',
      rules: {
        required: true
      }
    },
    tableType: {
      control: 'select',
      title: '类型',
      // 若数据是动态生产成，可配置ds，基于ds加载的数据最终会设置到data中
      data: [
        {text: '实体', value: 'entity'}
      ],
      props: {
        defaultValue: 'entity'
      }
    },
    enable: {
      control: 'checkbox',
      field: 'checkState',
      title: '启用',
      // 采用1、0来代替true、false
      value: 1
    },
    linked: {
      control: 'checkbox',
      title: '同步状态',
      // 采用1、0来代替true、false
      props: {
        disabled: true,
        placeholder: '',
        defaultValue: 0
      },
      isServerSaveIgnore: true
    },
    tableComment: {
      control: 'textarea',
      tips: '在创建、更新表时，信息会同步到数据库表元数据中',
      title: '表注解'
    }
  },
  layout: {
    type: 'table',
    rows: [{
      cols: [
        {span: 4, label: true, field: 'title'}, {span: 8, field: 'title'},
        {span: 4, label: true, field: 'tableName'}, {span: 8, field: 'tableName'}
      ]
    }, {
      cols: [
        {span: 4, label: true, field: 'tableSchema'}, {span: 8, field: 'tableSchema'},
        {span: 4, label: true, field: 'tableType'}, {span: 8, field: 'tableType'}
      ]
    }, {
      cols: [
        {span: 8, label: true, field: 'enable'}, {span: 16, field: 'enable'},
        {span: 8, label: true, field: 'linked'}, {span: 16, field: 'linked'}
      ]
    }, {
      cols: [{
        span: 24, rows: [{cols: [{span: 4, label: true, field: 'tableComment'}, {span: 20, field: 'tableComment'}]}]
      }]
    }],
    hidden: {
      // 各表单状态，需隐藏的内容
      common: {
        typeA: 'gs:$ctx.form.type!=="typeA"',
        typeB: 'gs:$ctx.form.type!=="typeB"',
        typeC: 'gs:$ctx.form.type!=="typeC"'
      },
      update: {password: 1, confirmPassword: 2},
      create: {},
      read: {}
    }
  },
  ds: {},
  vars: {},
  watch: {}
}
