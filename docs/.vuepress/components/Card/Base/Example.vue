<template>
  <div>
    <a-card title="Card title">
      <gl-card :opts="config.opts" :id="config.id" :type="config.type"></gl-card>

      <p style="fontSize: 14px;color: rgba(0, 0, 0, 0.85); marginBottom: 16px;fontWeight: 500"
      >
        Group title
      </p>
      <a-card title="Inner card title">
        <a href="#" slot="extra">More</a>
        Inner Card content
      </a-card>
      <a-card title="Inner card title" :style="{ marginTop: '16px' }">
        <a href="#" slot="extra">More</a>
        Inner Card content
      </a-card>
    </a-card>
  </div>
</template>

<script>
  import data from './data.js'

  export default {
    data() {
      return {
        config: data
      }
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style scoped>

</style>
