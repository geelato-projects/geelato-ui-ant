<template>
  <div class="code-box-demo">
      <a-slider
          range
          :max="23"
          :step="1"
          :defaultValue="[1, 7, 9,15,17,23]"
          @change="onChange"
          @afterChange="onAfterChange"
      />
  </div>
  <!--:marks="[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24]"-->
</template>
<script>
  export default {
    data() {
      return {
        disabled: false,
      };
    },
    methods: {
      onChange(value) {
        console.log('change: ', value);
      },
      onAfterChange(value) {
        console.log('afterChange: ', value);
      },
    },
  };
</script>
<style scoped>
  .code-box-demo .ant-slider {
    margin-bottom: 16px;
  }
</style>
