<template>
  <div style="display: inline-block">
    <span v-if="property.tips" :title="$i18n.tproxy(property.tipsI18n,property.tips)">
      <a-icon type="info-circle" @click="copyTips($i18n.tproxy(property.tipsI18n,property.tips))"/>
    </span>
    <span v-if="isRequired(property)" class="gl-required">*&nbsp;</span>{{$i18n.tproxy(titleI18n,title)}}
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
    mounted() {
      console.log('this.$i18n', this.$i18n)
    },
    computed: {
      title() {
        return this.label === true ? this.property.title : this.label
      },
      titleI18n() {
        return this.label === true ? this.property.titleI18n : this.label
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
        console.log('geelato-ui-ant > gl-label > tips >', tips)
      }
    }
  }
</script>

<style scoped>

</style>
