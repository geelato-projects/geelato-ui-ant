<template>
  <div>
    <gl-magic-form ref="magicForm" :opts="config"></gl-magic-form>
  </div>
</template>

<script>
  let formConfig = {
    type: 'object',
    // 表单可绑定多实体，这是默认第一实体
    defaultEntity: 'platform_dev_project',
    // update|create|read
    state: 'save',
    properties: {
      // 设置该id:{}，便于子实体中依赖该id
      id: {},
      name: {
        control: 'input',
        title: '名称',
        rules: {
          required: true
        }
      },
      tree: {
        control: 'input',
        title: '名称',
        value: 'tree'
      },
      description: {
        control: 'textarea',
        title: '描述'
      }
    },
    layout: {
      type: 'table',
      rows: [{
        // label为true时，展示的是property中title的内容，若需修改名称
        cols: [
          {span: 6, label: true, field: 'name'}, {span: 18, field: 'name'},
        ]
      }, {
        cols: [
          {span: 6, label: true, field: 'description'}, {span: 18, field: 'description'},
        ]
      }]
    }
  }
  export default {
    name: "gl-ide-plugin-project-create",
    data() {
      return {
        config: formConfig
      }
    }
  }
</script>

<style scoped>

</style>
