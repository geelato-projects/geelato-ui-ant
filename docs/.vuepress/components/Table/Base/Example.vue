<template>
  <div style="padding: 1.4em" class="gl-table-base-example">
    <gl-table ref="table" :opts="config" :query="{em:'platform_user'}"></gl-table>
  </div>
</template>
<script>
  import data from './data.js'

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
  .gl-table-base-example .gl-table {
    border: 0 !important;
  }

  .gl-table-base-example .table-operator {
    margin-top: 1em;
    margin-bottom: 1em;
  }
</style>
