<template>
  <gl-list-plus v-bind="config" @selectItem="(item)=>{selectedItem = item}"></gl-list-plus>
</template>
<script>
  import data from './data.js'


  export default {
    components: {},
    data() {
      return {
        selectedItem: '',
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
  .gl-card-grid {
    width: 100%;
    textAlign: 'center';
    background-color: #FFFFFF;
    cursor: pointer;
  }
</style>
