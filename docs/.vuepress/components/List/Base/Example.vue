<template>
  <div>
    <div>{{selectedItem?selectedItem:'No data.'}}</div>
    <gl-list v-bind="config" @selectItem="(item)=>{selectedItem = item}"></gl-list>
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
