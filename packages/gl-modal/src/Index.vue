<template>
  <!--:okText=modalConfig.okText-->
  <!--:cancelText=modalConfig.cancelText-->
  <a-modal
      :title=modalConfig.title
      :width=modalWidth
      :maskClosable="false"
      :closable="true"
      v-model="modalVisible"
      @ok="ok"
  >
    <template slot="footer">
      <template v-if="modalConfig.actions">
        <div :style="{'text-align': modalConfig.actionAlign||'center'}">
          <a-button v-for="(action,index) in modalConfig.actions"
                    :type="action.type?action.type:defaultBtnType"
                    :size="action.size?action.size:defaultBtnSize"
                    :loading="loading"
                    :key="index"
                    @click="handleAction(action,index)">{{action.text}}
          </a-button>
        </div>
      </template>
      <template>
        <div></div>
      </template>
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
        modalWidth: this.modalConfig.width || '520px',
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
      console.log('geelato-ui-ant > gl-modal > Index.vue > mounted() this.modalConfig: ', this.modalConfig)
      if (this.modalConfig.body) {
        this.loadComponent(this.modalConfig.body.component)
      }
    },
    methods: {
      handleAction(action, index) {
        let that = this
        that.loading = true
        // 解析 action
        console.log('geelato-ui-ant > gl-modal > Index.vue > handleAction() > index: ', index, ' action: ', action)
        that.$_doAction(action)
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
      /**
       *  @param data e.g. {fn:'save',code:'-1',message:'操作失败',data:{}}，成功时，code:'0',若无code也表示成功
       */
      doActionFromContent(actionResult) {
        console.log('geelato-ui-ant > gl-modal > doActionFromContent() > actionResult:', actionResult)
        console.log('geelato-ui-ant > gl-modal > doActionFromContent() > modalConfig.on ', this.modalConfig.on)
        for (let index in this.modalConfig.on) {
          let action = this.modalConfig.on[index]
          if (action.ctx === 'content' && action.fn === actionResult.fn) {
            if (actionResult.code === '0' || actionResult.code === 0 || actionResult.code === undefined || actionResult.code === '') {
              // 来源的操作是成功的，才执行下一步操作
              this.$_doAction(action.then, actionResult)
            }
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
