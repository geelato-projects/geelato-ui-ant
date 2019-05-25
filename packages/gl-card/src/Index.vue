<template>
  <div>
    <template v-if="type==='form'">
      <gl-form :opts="opts" :query="query" :ref="id"></gl-form>
    </template>
    <template v-else-if="type==='list'">
      <gl-table :opts="opts" :query="query" :ref="id"></gl-table>
    </template>
    <!--自定义的，非预定义的组件库内容-->
    <template v-else-if="type==='custom'">
      这是自定义的组件内容
    </template>
  </div>
</template>

<script>
  export default {
    name: "gl-card",
    props: {
      id: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      opts: {
        type: Object,
        required: true
      },
      query: {
        type: Object,
        required: false
      },
    },
  }
</script>

<style scoped>

</style>
