<template>
  <div>
    <button @click="openStaticPage">打开静态页面</button>
    <button @click="openDynamicPage">打开动态页面</button>
    <button @click="openListPage">打开列表页面</button>
    <div v-if="callbackParams">
      回调回写参数：{{callbackParams}}
    </div>
    <div v-if="callbackData">
      回调回写组件内容：{{callbackData}}
    </div>
  </div>
</template>

<script>
  import data from './data.js'

  export default {
    data() {
      return {
        callbackParams: '',
        callbackData: ''
      }
    },
    mounted() {
    },
    methods: {
      openStaticPage() {
        this.$gl.ui.openModal(this, data.staticPageConfig)
      },
      openDynamicPage() {
        this.$gl.ui.openModal(this, data.dynamicPageConfig)
      },
      openListPage() {
        this.$gl.ui.openModal(this, data.staticListPageConfig)
      },
      onSave(params, data) {
        this.callbackParams = params
        this.callbackData = data
      },
      openerFnExample(params, data, content) {
        this.$message.info('这是回调opener的示例。')
        this.callbackParams = params
        this.callbackData = data
      },
      openerFnExampleByContent(params, data, content) {
        console.log('openerFnExampleByContent', params, data)
        this.$message.info('这是由Modal的内容直接触发的事件。')
        this.callbackParams = params
        this.callbackData = data
      }
    }
  }
</script>

<style scoped>

</style>
