<template>
  <div>
    <button @click="openStaticPage">打开静态页面</button>
    <button @click="openDynamicPage">打开动态页面</button>
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
        this.$pageManager.openModal(this, data.staticPageConfig)
      },
      openDynamicPage() {
        this.$pageManager.openModal(this, data.dynamicPageConfig)
      },
      openerFnExample(params, data) {
        this.$message.info('这是回调opener的示例。')
        this.callbackParams = params
        console.log('data>', data)
        this.callbackData = typeof data.getValues === 'function' ? data.getValues() : ''

      }
    }
  }
</script>

<style scoped>

</style>
