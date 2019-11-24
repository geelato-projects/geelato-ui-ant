<template>
  <div class="gl-header">
    <a-icon class="gl-header-icon" :type="icon"></a-icon>
    <div class="gl-header-title">{{title}}</div>
    <div class="gl-header-extra" :style="{float: extra.align || 'right'}"
         v-if="extra&&extra.controls&&extra.controls.length>0">
      <template v-for="control in extra.controls">
        <gl-control :property="control" :form="form" style="margin-right: 0.1em"></gl-control>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: "GlHeader",
    props: {
      title: {
        type: String,
        required: true
      },
      icon: {
        type: String
      },
      extra: {
        type: Object,
        default() {
          return {
            // left right
            align: 'right',
            controls: []
          }
        }
      }
    },
    data() {
      return {
        form: {}
      }
    },
    mounted() {
    },
    updated() {
    },
    methods: {}
  }
</script>

<style>
  .gl-header {
    width: 100%;
    display: inline-block;
    padding-left: 1em;
  }

  .gl-header > .gl-header-title {
    display: inline-block;
    line-height: 2em;
    font-weight: 700;
  }

  .gl-header > .gl-header-extra {
    display: inline-block;
  }
</style>
