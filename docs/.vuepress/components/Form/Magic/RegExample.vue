<template>
  <div>
    <a-button type="primary" @click="refresh">刷新表单</a-button>
    <a-button type="primary" @click="validate">校验表单</a-button>
    <a-button type="primary" @click="getValues">获取表单值</a-button>
    <a-button type="primary" @click="getGql">获取保存GQL</a-button>
    <gl-magic-form ref="magicForm" :opts="config"></gl-magic-form>
  </div>
</template>

<script>
  import RegData from './RegData.js'

  export default {
    name: "RegExample",
    data() {
      return {
        config: RegData
      }
    },
    methods: {
      refresh() {
        this.$refs.magicForm.reset(RegData)
      },
      getGql() {
        this.$refs.magicForm.reset(RegData)
      },
      getValues() {
        this.$refs.magicForm.reset(RegData)
      },
      validate() {
        this.$refs.magicForm.reset(RegData)
      }
    }
  }
</script>

<style scoped>
  button {
    margin: 0.5em 0;
  }
</style>
