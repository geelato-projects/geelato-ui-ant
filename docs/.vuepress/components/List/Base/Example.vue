<template>
  <div>
    <gl-list v-bind="config"></gl-list>
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
