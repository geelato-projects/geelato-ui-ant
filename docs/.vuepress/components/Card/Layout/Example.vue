<template>
  <gl-card-layout :cardMap="config.cardMap" :layout="config.layout"></gl-card-layout>
</template>

<script>
  import data from './data.js'

  export default {
    data() {
      return {
        config: data
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style scoped>

</style>
