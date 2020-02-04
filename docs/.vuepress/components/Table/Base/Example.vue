<template>
  <div>
    <gl-table ref="table" :opts="config" :query="{em:'platform_demo_entity'}"></gl-table>
  </div>
</template>
<script>
  import data from './demo.js'

  export default {
    components: {},
    data() {
      return {
        config: data
      }
    },
    computed: {},
    created() {
    },
    mounted() {

    },
    methods: {
      refreshTable() {
        this.$refs.table.refresh(true)
      }
    }
  }
</script>
<style>

</style>
