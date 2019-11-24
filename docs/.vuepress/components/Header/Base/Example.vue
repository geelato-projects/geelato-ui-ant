<template>
  <div>
    <gl-header v-bind="config" @selectItem="(item)=>{selectedItem = item}"></gl-header>
  </div>
</template>
<script>
  import data from './data.js'

  export default {
    components: {},
    data() {
      return {
        config: data,
        selectedItem: ''
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
