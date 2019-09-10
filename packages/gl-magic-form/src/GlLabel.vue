<template>
  <div style="display: inline-block">
    <span v-if="property.tips" :title="property.tips">
      <a-icon type="info-circle" @click="copyTips(property.tips)"/>
    </span>
    <span v-if="isRequired(property)" class="gl-required">*&nbsp;</span>{{title}}
  </div>
</template>

<script>

  export default {
    name: "GlLabel",
    props: {
      /*
      * 若为true，则取property.title的值为作为展示的内容
      * 若为字符串，则直接展示字符串的内容
      * */
      label: {
        type: [String, Boolean]
      },
      property: {
        type: Object,
        required: true
      }
    },
    computed: {
      title() {
        return this.label === true ? this.property.title : this.label
      }
    },
    methods: {
      /**
       * 检查字段是否必填
       * @param property 字段配置信息
       * @returns {boolean}
       */
      isRequired(property) {
        return property.rules && property.rules.required
      },
      copyTips(tips) {
        console.log('tips >', tips)
      }
    }
  }
</script>

<style scoped>

</style>
