<template>
  <table style="width: 98%">
    <tr>
      <th style="width: 30%">控件</th>
      <th style="width: 70%">示例</th>
      <th style="min-width: 10em">值</th>
    </tr>
    <tr v-for="property in config.properties">
      <td>{{property.control}} ({{property.title}})</td>
      <td>
        <gl-control :form="form" :gid="property.gid" :opts="property" @propertyUpdate="onPropertyUpdate"
                    @loadRefData="onLoadRefData"></gl-control>
      </td>
      <td>{{form[property.gid]}}</td>
    </tr>
    <tr>
      <td>slider</td>
      <td>
        <my-slider></my-slider>
      </td>
    </tr>
  </table>
</template>
<script>
  import MySlider from './Slider'
  import data from './data.js'

  export default {
    components: {MySlider},
    data() {
      return {
        form: {},
        config: data
      }
    },
    computed: {},
    created() {
    },
    mounted() {

    },
    methods: {
      onPropertyUpdate() {

      },
      onLoadRefData() {
      }
    }
  }
</script>
<style>
</style>
