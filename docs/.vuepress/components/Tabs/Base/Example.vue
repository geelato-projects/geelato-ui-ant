<template>
  <div>
    <gl-tabs v-bind="config"></gl-tabs>
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
