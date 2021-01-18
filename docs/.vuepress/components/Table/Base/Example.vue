<template>
  <div>
    <div style="margin:1em 0;background-color: silver;width: 100%">
      <a-button class="primary" @click="changeDataAndRefreshTable">添加操作列按钮数据并刷新</a-button>
      <a-button class="danger" @click="deleteByEntity">删除所选</a-button>
      <a-button class="primary" @click="getRefControl">获取所有的control</a-button>
      <span class="ant-alert-message">
      名称字段的值，被类型下拉列表依赖，值更改时，需刷新类型下拉列表
    </span>
    </div>

    <gl-table ref="table" gid="IKJUYHTGRFEDW653" v-bind="config.bind" :params="config.params"></gl-table>
  </div>
</template>
<script>
  import tableData from './demo4.js'

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
          "fn": "$_openModal",
          "ctx": "this",
          params: {},
          dataMapping: {}
        })
        this.refreshTable()
      },
      deleteByEntity() {
        this.$refs.table.deleteByEntity({entityName: 'platform_demo_entity'})
      },
      refreshTable() {
        this.$refs.table.refresh(true)
      },
      getRefControl() {
        
      }
    }
  }
</script>
<style>

</style>
