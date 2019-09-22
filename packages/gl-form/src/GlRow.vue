<template>
  <div class="gl-table" :class="clazz">
    <div class="gl-table-row">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GlRow",
    props: {
      type: {
        type: String,
        default() {
          'primary'
        }
      }
    },
    computed: {
      clazz() {
        let clazz = {}
        if (this.type) {
          clazz[this.type] = true
        }
        return clazz
      }
    },
    mounted() {
      // setAsTableContainer，以便于其增加gl-table-container样式
      if (typeof this.$parent.setAsTableContainer === "function") {
        this.$parent.setAsTableContainer(true)
      }
    }
  }
</script>

<style scoped>

</style>
