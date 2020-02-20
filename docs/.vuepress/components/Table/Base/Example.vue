<template>
  <div>
    <div style="margin:1em 0;background-color: silver;width: 100%">
      <a-button class="primary" @click="changeDataAndRefreshTable">添加操作列按钮数据并刷新</a-button>
    </div>
    <gl-table ref="table" :opts="config" :query="{em:'platform_demo_entity'}"></gl-table>
  </div>
</template>
<script>
  import tableData from './demo.js'

  export default {
    components: {},
    data() {
      return {
        config: tableData
      }
    },
    computed: {},
    created() {
    },
    mounted() {

    },
    methods: {
      changeDataAndRefreshTable() {
        this.config.table.rowAction.actions.push({
          gid: this.$gl.utils.uuid(8),
          "text": this.$gl.utils.uuid(8),
          "icon": "plus",
          "type": "primary",
          "fn": "openModal",
          "ctx": "this",
          params: {},
          dataMapping: {}
        })
        this.refreshTable()
      },
      refreshTable() {
        this.$refs.table.refresh(true)
      }
    }
  }
</script>
<style>

</style>
