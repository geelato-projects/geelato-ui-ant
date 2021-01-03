export default {
  "bind": {
    "opts": {
      type: 'object',
      // 表单可绑定多实体，这是默认第一实体
      defaultEntity: 'platform_demo_entity',
      // update|create|read
      state: 'save',
      properties: {
        // 设置该id:{}，便于子实体中依赖该id
        id: {},
        name: {
          control: 'input',
          title: '名称'
        },
        code: {
          control: 'input',
          title: '编码',
          rules: {
            required: true
          }
        },
        type: {
          control: 'select',
          title: '类型',
          // 若数据是动态生产成，可配置ds，基于ds加载的数据最终会设置到data中
          data: [{text: '默认', value: 0}, {text: '类型一', value: 1}, {text: '类型二', value: 2}
          ],
          props: {
            defaultValue: 1
            // defaultActiveIndex: 1
          }
        },
        description: {
          gid: 'asdfasdfasfoi',
          control: 'textarea',
          title: '描述'
        }
      },
      layout: {
        type: 'table',
        rows: [{
          cols: [
            {span: 4, label: true, field: 'name'}, {span: 8, field: 'name'},
            {span: 4, label: true, field: 'code'}, {span: 8, field: 'code'}
          ]
        }, {
          // label为true时，展示的是property中title的内容，若需修改名称
          cols: [
            {span: 4, label: true, field: 'type'}, {span: 20, field: 'type'}
          ]
        }
          , {cols: [{span: 4, label: true, field: 'description'}, {span: 20, field: 'description'}]}
          // , {
          //   cols: [{
          //     span: 24, rows: [{cols: [{span: 4, label: true, field: 'content'}, {span: 20, field: 'content'}]}]
          //   }]
          // }, {
          //   cols: [{
          //     span: 24, rows: [{cols: [{span: 4, label: true, field: 'description'}, {span: 20, field: 'description'}]}]
          //   }]
          // }
        ],
        hidden: {}
      },
      toolbar: {
        show: true,
        actions: [{
          text: '保存',
          type: 'primary',
          fn: 'save',
          show: 'true',
          icon: '',
          ctx: 'self'
        }]
      },
      ds: {},
      vars: {},
      watch: {}
    }
  }
}
