<template>
  <div class="gl-table-cell" :class="clazz">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "GlCell",
    props: {
      span: {
        type: Number,
        default() {
          return 1
        }
      },
      label: {
        type: [Boolean, String],
        default() {
          return false
        }
      },
      type: {
        type: String,
        default() {
          'primary'
        }
      }
    },
    data() {
      return {
        isTableContainer: false
      }
    },
    computed: {
      clazz() {
        let clazz = {}
        clazz['gl-col-' + this.span] = true
        clazz['label'] = this.label ? true : false
        clazz['gl-table-container'] = this.isTableContainer
        if (this.type) {
          clazz[this.type] = true
        }
        return clazz
      }
    },
    methods: {
      setAsTableContainer(isTableContainer) {
        this.isTableContainer = isTableContainer === false ? false : true
      }
    }
  }
</script>

<style scoped>

</style>
