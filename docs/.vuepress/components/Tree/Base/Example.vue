<template>
  <div>
    <gl-tree ref="tree" v-bind="config.bind"></gl-tree>
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
    methods: {}
  }
</script>
<style>
</style>
