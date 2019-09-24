<template>
  <!--:okText=modalConfig.okText-->
  <!--:cancelText=modalConfig.cancelText-->
  <a-modal
      :title=modalConfig.title
      :width=modalConfig.width || 520
      :maskClosable="false"
      :closable="true"
      v-model="modalVisible"
      @ok="ok"
  >
    <template slot="footer" v-if="modalConfig.actions">
      <a-button v-for="(action,index) in modalConfig.actions"
                :type="action.type?action.type:defaultBtnType"
                :size="action.size?action.size:defaultBtnSize"
                :loading="loading"
                :key="index"
                @click="handleAction(action,index)">{{action.text}}
      </a-button>
      <!--<a-button key="submit" type="primary"  @click="ok">-->
      <!--Submit-->
      <!--</a-button>-->
    </template>
    <component ref="$content" :componentUpdated="isMounted=true" :is="bodyComponent"
               v-bind='modalConfig.body.opts || modalConfig.body.props'
               :opener="opener" :modal="modal"
               @doAction="doActionFromContent"
    >
      正在加载...
    </component>
  </a-modal>
</template>

<script>
  /* eslint-disable no-unused-vars */

  import mixin from '../../mixin'

  export default {
    name: "GlModal",
    mixins: [mixin],
    props: {
      modalId: String,
      opener: {
        type: Object
      },
      // modalHeader:  {title: ''},
      // modalFooter: null,
      // body: [Function, Object],
      modalConfig: {
        type: Object,
        default() {
          return {title: '未设置modalConfig'}
        }
      },
      actions: {
        type: Array,
        default() {
          return []
        }
      },
      // 回调事件集合 格式如：{selected:function(data){ // do something }}
      callbackSet: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        bodyComponent: undefined,
        isMounted: false,
        modalVisible: true,
        loading: false,
        defaultBtnType: 'default',
        defaultBtnSize: 'default'
      }
    },
    computed: {
      modal() {
        console.log('geelato-ui-ant > gl-modal > Index.vue > modal() > this: ', this)
        return this
      },
      content() {
        return this.$refs.$content
      }
    },
    mounted() {
      this.loadComponent(this.modalConfig.body.component)
    },
    methods: {
      handleAction(action, index) {
        let that = this
        that.loading = true
        // 解析 action
        console.log('geelato-ui-ant > gl-modal > Index.vue > handleAction() > index: ', index, ' action: ', action)
        that.doAction(action)
        that.loading = false
      },
      ok() {
        this.loading = true
        this.modalVisible = false
        this.loading = false
      },
      cancel() {
        this.modalVisible = false
      },
      close() {
        this.cancel()
      },
      doActionFromContent(data) {
        // console.log('geelato-ui-ant > doActionFromContent: ', data, this.modalConfig.on)
        for (let index in this.modalConfig.on) {
          let action = this.modalConfig.on[index]
          if (action.ctx === 'content' && action.fn === data.fn) {
            this.doAction(action.then, data)
            break
          }
        }
      },
      /**
       * 加载内容组件
       * @param component 全局组件名称、组件对象、组件编码（用于远程加载）
       */
      loadComponent(component) {
        if (typeof component === 'string') {
          const theComponent = this.$gl.globalVue.component(component)
          console.log('geelato-ui-ant > gl-modal > src  > Index.vue > loadComponent() > theComponent: ', theComponent, 'by componentName:', component)
          if (theComponent) {
            this.bodyComponent = theComponent
          } else {
            // 基于动态组件名，需从服务端获取组件配置信息
            let pageCode = component
            this.$gl.api.queryPageByCode(pageCode).then(function (res) {
              console.log('geelato-ui-ant > gl-modal > src  > Index.vue > loadComponent()  > res', res)
            })
          }
        } else if (typeof component === 'object') {
          // base on local static component
          this.bodyComponent = component
        } else {
          console.error("gl-modal > src  > Index.vue > loadComponent() > 不支持的组件格式，component: ", component)
        }
      }
    }
  }
</script>

<style scoped>

</style>
