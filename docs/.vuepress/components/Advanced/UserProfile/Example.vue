<template>
  <div>
    <a-card>
      <gl-tabs v-bind="config"></gl-tabs>
    </a-card>
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
