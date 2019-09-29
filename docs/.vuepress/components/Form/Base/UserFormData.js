export default {
  type: 'object',
  // 表单可绑定多实体，这是默认第一实体
  defaultEntity: 'platform_user',
  // update|create|read
  state: 'save',
  properties: {
    // 设置该id:{}，便于子实体中依赖该id
    id: {},
    name: {
      control: 'input',
      title: '姓名'
    },
    loginName: {
      control: 'input',
      title: '登录名',
      rules: {
        required: true
      }
    },
    email: {
      control: 'email',
      title: '邮箱',
      rules: {
        required: true,
        email: true,
        // 唯一的，不重复的
        // unique:true
      },
      props: {
        placeholder: 'xxx@xxx.xxx'
      }
    },
    avatar: {
      control: 'image',
      title: '头像',
      value: 'elliot',
    },
    sex: {
      control: 'select',
      title: '性别',
      // 若数据是动态生产成，可配置ds，基于ds加载的数据最终会设置到data中
      data: [
        {text: '保密', value: 2},
        {text: '男', value: 1},
        {text: '女', value: 0}
      ],
      props: {
        defaultValue: 2
      }
    },
    tel: {
      control: 'input',
      title: '电话',
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
    province: {
      control: 'select',
      field: 'provinceCode',
      title: '省份',
      ds: 'province',
      // 广东省
      value: '440000'
    },
    city: {
      control: 'select',
      title: '城市',
      field: 'cityCode',
      // 基于数据源，数源名称可自取，如cityDS，不一定需等于本属性名
      ds: 'city',
      // js: "gs:$ctx.form.city=$ctx.form.province",
      // 当为data设置了数组项之后，默认激活项的索引
      props: {
        defaultActiveIndex: 0
      }
    },
    enable: {
      control: 'checkbox',
      field: 'checkState',
      title: '启用',
      // 采用1、0来代替true、false
      value: 1
    },
    description: {
      control: 'textarea',
      title: '描述'
    }
  },
  layout: {
    type: 'table',
    rows: [{
      cols: [
        {
          span: 12,
          rows: [{
            cols: [{span: 8, label: true, field: 'name'}, {span: 16, field: 'name'}]
          }, {
            cols: [{span: 8, label: true, field: 'sex'}, {span: 16, field: 'sex'}]
          }, {
            cols: [{span: 8, label: true, field: 'age'}, {span: 16, field: 'age'}]
          }, {
            cols: [{span: 8, label: true, field: 'tel'}, {span: 16, field: 'tel'}]
          }]
        },
        {span: 4, label: true, field: 'avatar'}, {span: 8, field: 'avatar'}
      ]
    }, {
      cols: [
        {span: 4, label: true, field: 'province'}, {span: 8, field: 'province'},
        {span: 4, label: true, field: 'city'}, {span: 8, field: 'city'}
      ]
    }, {
      // label为true时，展示的是property中title的内容，若需修改名称
      cols: [
        {span: 8, label: true, field: 'loginName'}, {span: 16, field: 'loginName'},
        {span: 8, label: true, field: 'email'}, {span: 16, field: 'email'}
      ]
    }, {
      cols: [{
        span: 24, rows: [{cols: [{span: 4, label: true, field: 'description'}, {span: 20, field: 'description'}]}]
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
  ds: {
    province: {
      entity: 'platform_province',
      // default false
      lazy: false,
      // 支持字段重命名
      fields: 'name,code',
      resultMapping: {
        text: 'name',
        value: 'code'
      },
      description: '这是一个下拉列表数据源'
    },
    city: {
      entity: 'platform_city',
      lazy: true,
      fields: 'name,code',
      resultMapping: {
        text: 'name',
        value: 'code'
      },
      // 带参数查询的数据源
      params: {
        // 该信息会自动加入计算属性中，当province的值变动时，该数据源会重新加载计算
        provinceCode: 'gs:$ctx.form.province'
      },
      description: '这是一个下拉列表数据源，带参数'
    }
  },
  vars: {
    myVarA: {
      description: '这是一个变量，变量名字为myVarA，值为30',
      value: '30'
    }
  },
  watch: {
    'code': function () {

    }
  }
}
