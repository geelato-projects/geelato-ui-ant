<template>
  <gl-list-plus v-bind="config" @selectItem="(item)=>{selectedItem = item}"></gl-list-plus>
</template>
<script>
  import data from './data.js'
  import Form from '../Form'

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
      console.log('Form > ', Form, Form.methods, Object.keys(Form.methods).filter((item) => {
        return item.indexOf('$_') !== -1
      }))
      console.log('Form.props.query.type>', Form.props.query.type.name)
      console.log('Form.props.name.type>', Form.props.name.type.name)
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
