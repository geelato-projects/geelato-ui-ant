export default {
  "bind": {
    "opts": {
      type: 'object',
      // 表单可绑定多实体，这是默认第一实体
      defaultEntity: 'platform_user',
      // update|create|read
      state: 'save',
      properties: {
        // 设置该id:{}，便于子实体中依赖该id
        id: {},
        name: {
          control: 'Input',
          title: '姓名',
          titleI18n:'i18n-zsedcftg',
          rules: {
            required: true,
            unique: true
          },
          readOnly: true,
          value: '',
          // variable
          valueExpression: 'js:ctx.form.firstName'
        },
        firstName: {
          control: 'Input',
          title: '名',
          rules: {
            required: true
          }
        },
        lastName: {
          control: 'Input',
          title: '姓',
          rules: {
            required: true
          }
        },
        loginName: {
          control: 'Input',
          title: '登录名',
          titleI18n:'登录名',
          rules: {
            required: true,
            unique: {
              entityReader: {
                entity: 'platform_user',
                // default false
                lazy: false,
                // 支持字段重命名
                fields: 'loginName',
                params: [{
                  name: 'loginName',
                  cop: 'eq',
                  value: 'js:ctx.form.loginName'
                }],
              }
            }
          }
        },
        password: {
          control: 'Password',
          title: '密码',
          tips: '至少6位',
          tipsI18n: 'i18n-udyehiowij',
          rules: {
            required: true,
            min: 6
          }
        },
        confirmPassword: {
          control: 'password',
          title: '确认密码',
          rules: {
            required: true,
            min: 6,
            confirmed: 'password'
          }
        },
        email: {
          control: 'email',
          title: '邮箱',
          rules: {
            required: true,
            email: true
          },
          props: {
            placeholder: 'xxx@xxx.xxx',
            placeholderI18n: 'xxx@xxx.xxx'
          }
        },
        age: {
          control: 'Input',
          title: '年龄',
          // 值
          value: '20',
          rules: {
            numeric: true
          }
        },
        avatar: {
          control: 'Image',
          title: '头像',
          value: 'elliot',
        },
        sex: {
          control: 'Select',
          title: '性别',
          titleI18n:'性别',
          // 若数据是动态生产成，可配置ds，基于ds加载的数据最终会设置到data中
          data: [
            {text: '保密', value: 2},
            {text: '男', value: 1},
            {text: '女', value: 0}
          ],
          rules: {
            required: true
          },
          props: {
            defaultActiveIndex: 1
          }
        },
        tel: {
          control: 'Input',
          title: '电话',
          // 如果实体的字段名称与tel不一样，或因多实体都存在tel字段，可通过field指定，field未设置时，field:'tel'
          field: 'telephone',
          // 若字段需绑定其它实体，该通过该属性设置
          entity: 'platform_user',
          rules: {
            required: true,
            numeric: true,
            //08613912345678
            min: 11,
            max: 14
          },
          props: {
            placeholder: '电话号码',
            placeholderI18n: '电话号码'
          }
        },
        province: {
          control: 'Select',
          title: '省份',
          dsName: 'province',
          // 广东省
          value: '440000'
        },
        city: {
          control: 'Select',
          title: '城市',
          // 基于数据源，数源名称可自取，如cityDS，不一定需等于本属性名
          dsName: 'city',
          // js: "js:ctx.form.city=ctx.form.province",
          props: {
            // 当为data设置了数组项之后，默认激活项的索引
            defaultActiveIndex: 0
          }
        },
        enable: {
          control: 'Checkbox',
          title: '启用',
          value: true
        },
        description: {
          control: 'Textarea',
          title: '描述'
        }
      },
      layout: {
        type: 'table',
        // 默认为right
        label: {align: 'left'},
        rows: [{
          cols: [
            {
              span: 12,
              rows: [{
                cols: [{span: 8, label: true, field: 'lastName'}, {span: 16, field: 'lastName'}]
              }, {
                cols: [{span: 8, label: true, field: 'firstName'}, {span: 16, field: 'firstName'}]
              }, {
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
          cols: [
            {span: 4, label: true, field: 'password'}, {span: 8, field: 'password'},
            {span: 4, label: true, field: 'confirmPassword'}, {span: 8, field: 'confirmPassword'}
          ]
        }, {
          cols: [{
            span: 24, rows: [{cols: [{span: 4, label: true, field: 'description'}, {span: 20, field: 'description'}]}]
          }]
        }],
        hidden: {
          // 各表单状态，需隐藏的内容
          common: {
            typeA: 'js:ctx.form.type!=="typeA"',
            typeB: 'js:ctx.form.type!=="typeB"',
            typeC: 'js:ctx.form.type!=="typeC"'
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
          description: 'js:`这是一个下拉列表数据源${ctx}`'
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
          params: [{
            // 该信息会自动加入计算属性中，当province的值变动时，该数据源会重新加载计算
            name: 'provinceCode',
            cop: 'eq',
            value: 'js:ctx.form.province'
          }],
          description: '这是一个下拉列表数据源，带参数'
        }
      },
      vars: {
        myVarA: {
          description: '这是一个变量，变量名字为myVarA，值为30',
          value: '30'
        }
      },
      i18n: {
        zh: {
          '姓': '姓',
          '名': '名',
          'i18n-zsedcftg': '姓名',
          '电话': '电话',
          '电话号码': '电话号码',
          '性别': '性别',
          '年龄': '年龄'
        },
        en: {
          '姓': 'last name',
          '名': 'first name',
          'i18n-zsedcftg': 'full name',
          '电话': 'telephone',
          '电话号码': 'telephone number',
          '性别': 'sex',
          '年龄': 'age',
          'i18n-udyehiowij': 'At least 6'
        }
      },
      watch: {
        'code': function () {

        }
      }
    },
    "params": {}
  }
}
