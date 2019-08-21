<template>
  <div>
    <gl-list v-bind="config" @doAction="onListDoAction"></gl-list>
  </div>
</template>

<script>
  let config = {
    entityDataReader: {
      entity: 'platform_dev_project',
      fields: 'id,name,updateAt,description',
      withMeta: false,
      // key为组件内用到的字段名，右边为实体查询结果返回的字段
      // 当右边的字段不在fieldNames的范围内时，则该值为静态值，如以下的avatarUrl
      resultMapping: {
        // avatarUrl: '@/public/images/gl-ide-plugin-project/project.png',
        title: `$ctx.name`,
        content: `$utils.dateFormat($ctx.updateAt,'yyyy-MM-dd')`,
        description: 'description'
      }
    }
  }
  export default {
    name: "gl-ide-plugin-project-list",
    data() {
      return {
        config: config
      }
    },
    methods: {
      onListDoAction(data) {
        console.log('ProjectList: onListDoAction, data:', data)
        this.$emit('doAction', data)
      }
    }
  }
</script>

<style scoped>

</style>
