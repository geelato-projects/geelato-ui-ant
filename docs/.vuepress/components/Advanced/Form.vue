<template>
</template>

<script>
  export default {
    name: "Form",
    props: {
      query: {
        type: Object,
        default() {
          return {}
        }
      },
      name: {
        type: String,
        default() {
          return ''
        }
      },
    },
    methods: {
      /**
       * info
       */
      $_call(name) {

      }
    }
  }
</script>

<style scoped>

</style>
