<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

  export default {
    name: 'app',
    components: {
    },
    data() {
      return {
        locale: zhCN
      }
    }
  }
</script>

<style>
  #app {
    height: 100%;
  }

  /*#app {*/
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  /*-webkit-font-smoothing: antialiased;*/
  /*-moz-osx-font-smoothing: grayscale;*/
  /*text-align: center;*/
  /*color: #2c3e50;*/
  /*margin-top: 60px;*/
  /*}*/
</style>
