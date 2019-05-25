<template>
  <div>
    <gl-card-layout-item :rows="layout.rows" :cardMap="cardMap"></gl-card-layout-item>
  </div>
</template>

<script>
  import GlCardLayoutItem from './Item'

  export default {
    name: "gl-card-layout",
    components: {GlCardLayoutItem},
    props: {
      cardMap: {
        type: Object,
        required: true
      },
      layout: {
        type: Object,
        required: true
      },
      // 打开本组件的来源组件
      opener: {
        type: Object,
        required: false
      },
      // 通过modal窗口打开该页面时，可获取到该窗口的引用
      modal: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        // cards: this.opts.cards,
      }
    },
    methods: {
      validate() {

      },
      getGql() {

      },
      save() {

      },
      setValues() {

      },
      /**
       * 若工具体中的方法合并到父组件中
       * 若父组件存在方法addAction，则表示可合并子组件中的action
       * 如，在modal中打开该组件时，则将工具条中的action合并到modal的工具条中
       */
      appendActionToParent() {

      }
    }
  }
</script>

<style scoped>

</style>
