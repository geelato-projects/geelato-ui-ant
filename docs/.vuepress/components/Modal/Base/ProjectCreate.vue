<template>
  <div>
    <gl-form ref="magicForm" :opts="config"></gl-form>
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
        field: 'name',
        rules: {
          required: true
        }
      },
      tree: {
        field: 'tree',
        value: ''
      },
      description: {
        control: 'textarea',
        title: '描述',
        field: 'description'
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
    },
    mounted() {
      console.log('>>$validator', this.$validator)
    },
    methods: {
      save() {
        return this.$refs.magicForm.save()
      }
    }
  }
</script>

<style scoped>

</style>
