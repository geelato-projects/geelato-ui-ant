export default {
  type: 'object',
  // 表单可绑定多实体，这是默认第一实体
  defaultEntity: 'platform_dev_column',
  // update|create|read
  state: 'save',
  properties: {
    // 设置该id:{}，便于子实体中依赖该id
    id: {},
    tableId: {},
    name: {
      control: 'input',
      title: '列名',
      rules: {
        required: true
      },
      props: {
        placeholder: '英文，即数据库列名'
      }
    },
    title: {
      control: 'input',
      title: '标题',
      rules: {
        required: true
      }
    },
    nullable: {
      control: 'checkbox',
      title: '可空',
      rules: {
        required: true
      }
    },
    defaultValue: {
      control: 'input',
      title: '默认值'
    },
    type: {
      control: 'select',
      title: '控件类型',
      // 若数据是动态生产成，可配置ds，基于ds加载的数据最终会设置到data中
      data: [
        {text: 'String', value: 'String'},
        {text: 'long', value: 'long'},
        {text: 'Date', value: 'Date'},
        {text: 'boolean', value: 'boolean'},
        {text: 'int', value: 'int'}
      ],
      props: {
        defaultValue: 'String'
      }
    },
    dataType: {
      control: 'select',
      title: '数据类型',
      tips: '数据库中的字段类型',
      data: [
        {text: 'String', value: 'String'},
        {text: 'long', value: 'long'},
        {text: 'Date', value: 'Date'},
        {text: 'boolean', value: 'boolean'},
        {text: 'int', value: 'int'}
      ],
      props: {
        defaultValue: 'String'
      }
    },
    charMaxLength: {
      control: 'input',
      title: '最大长度',
      rules: {
        required: true,
        numeric: true
      }
    },
    checkState: {
      control: 'checkbox',
      field: 'checkState',
      title: '审核状态',
      // 采用1、0来代替true、false
      value: 1
    },
    comment: {
      control: 'textarea',
      title: '描述'
    }
  },
  layout: {
    type: 'table',
    rows: [{
      cols: [
        {span: 8, label: true, field: 'name'}, {span: 16, field: 'name'},
        {span: 8, label: true, field: 'title'}, {span: 16, field: 'title'}
      ]
    }, {
      cols: [
        {span: 8, label: true, field: 'type'}, {span: 16, field: 'type'},
        {span: 8, label: true, field: 'dataType'}, {span: 16, field: 'dataType'}
      ]
    }, {
      cols: [
        {span: 8, label: true, field: 'charMaxLength'}, {span: 16, field: 'charMaxLength'},
        {span: 8, label: true, field: 'defaultValue'}, {span: 16, field: 'defaultValue'}
      ]
    }, {
      cols: [
        {span: 8, label: true, field: 'nullable'}, {span: 16, field: 'nullable'},
        {span: 8, label: true, field: 'checkState'}, {span: 16, field: 'checkState'}
      ]
    }, {
      cols: [{
        span: 24, rows: [{cols: [{span: 4, label: true, field: 'comment'}, {span: 20, field: 'comment'}]}]
      }]
    }],
    hidden: {}
  },
  ds: {},
  vars: {},
  watch: {}
}
