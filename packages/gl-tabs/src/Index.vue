<template>
  <a-tabs :defaultActiveKey="defaultActiveIndex" :animated="animated" :hideAdd="hideAdd" :size="size"
          :tabPosition="tabPosition" :type="type" :tabBarGutter="tabBarGutter" @change="change" @edit="edit"
          @nextClick="nextClick"
          @prevClick="prevClick" @tabClick="tabClick">
    <a-tab-pane v-for="(pane,index) in panes" :key="index">
      <span slot="tab" @click="loadComponent(pane)">
        <a-icon v-if="pane.icon" :type="pane.icon"/>
        {{pane.title}}
      </span>
      <component :ref="pane.title" :is="paneComponents[pane.title]" v-bind='pane.content.props'
                 @doAction="doActionFromContent">
        正在加载...
      </component>
    </a-tab-pane>
  </a-tabs>
</template>


<script>
  import mixin from '../../mixin'

  export default {
    name: 'GlTabs',
    mixins: [mixin],
    components: {},
    props: {
      panes: {
        type: Array,
        default() {
          return []
        }
      },
      // 是否使用动画切换 Tabs，在 tabPosition=top|bottom 时有效
      animated: {
        type: Boolean
      },
      // 初始化选中面板的 index
      defaultActiveIndex: {
        type: Number,
        default() {
          return 0
        }
      },
      // 是否隐藏加号图标，在 type="editable-card" 时有效
      hideAdd: {
        type: Boolean,
        default() {
          return false
        }
      },
      // 大小，提供 large default 和 small 三种大小
      size: {
        type: String,
        default() {
          return 'default'
        }
      },
      // 页签位置，可选值有 top right bottom left
      tabPosition: {
        type: String,
        default() {
          return 'top'
        }
      },
      // 页签的基本样式，可选 line、card editable-card 类型
      type: {
        type: String,
        default() {
          return 'line'
        }
      },
      // tabs 之间的间隙
      tabBarGutter: {
        type: Number
      }
    },
    data() {
      return {
        paneComponents: {}
      }
    },
    mounted() {
      if (this.panes.length > 0) {
        this.loadComponent(this.panes[this.defaultActiveIndex])
      }
    },
    methods: {
      loadComponent(pane) {
        this.$set(this.paneComponents, pane.title, this.$gl.ui.loadComponent(pane.content.component))
      },
      doActionFromContent() {

      },
      change() {

      },
      // 新增和删除页签的回调，在 type="editable-card" 时有效
      edit() {

      },
      // next 按钮被点击的回调
      nextClick() {

      },
      // prev 按钮被点击的回调
      prevClick() {

      },
      // tab 被点击的回调
      tabClick() {

      }
    }
  }
</script>

<style scoped>
</style>
