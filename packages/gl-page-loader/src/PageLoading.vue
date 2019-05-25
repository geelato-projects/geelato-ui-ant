<template>
  <div>
    <a-spin tip="加载中...">
      <div class="spin-content">
      </div>
    </a-spin>
  </div>
</template>
<script>
  export default {
    data() {
      return {}
    },
    created: function () {
    },
    watch: {},
    methods: {}
  }
</script>
<style scoped>
  .spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
  }
</style>
