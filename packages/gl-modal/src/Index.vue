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
    <component ref="$content" :componentUpdated="isMounted=true" :is="body"
               :opts="modalConfig.body.opts"
               :query="modalConfig.body.query"
               :opener="opener" :modal="thisModal"
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
    name: "gl-modal",
    mixins: [mixin],
    props: {
      modalId: String,
      opener: {
        type: Object
      },
      // modalHeader:  {title: ''},
      // modalFooter: null,
      body: [Function, Object],
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
        isMounted: false,
        modalVisible: true,
        loading: false,
        defaultBtnType: 'default',
        defaultBtnSize: 'default'
      }
    },
    computed: {
      thisModal() {
        console.log('packages > gl-modal > Index.vue > thisModal() > this: ', this)
        return this
      },
      content() {
        return this.$refs.$content
      }
    },
    methods: {
      handleAction(action, index) {
        let that = this
        that.loading = true
        // 解析 action
        console.log('packages > gl-modal > Index.vue > handleAction() > index: ', index, ' action: ', action)
        that.doAction(action)
        that.loading = false


      },
      doAction(action, data) {
        let that = this
        if (!action) {
          return
        }
        if (typeof action !== 'object' || !action.fn) {
          console.warn('无效的action: ', action)
          return
        }
        let content = Object.values(that.$refs.$content.$refs)[0]
        let ctx = undefined
        if (action.ctx === 'opener') {
          ctx = that.opener
        } else if (action.ctx === 'modal') {
          ctx = that
        } else {
          ctx = content
        }

        let promise = ctx[action.fn](action.params, data, content)
        if (promise && typeof promise.then === 'function') {
          promise.then(function (data) {
            that.doAction(action.then, data)
          }).catch(function (data) {
            that.doAction(action.fail, data)
          })
        } else {
          that.doAction(action.then)
          // console.log('ctx[action.fn](action.params) > promise: ', promise)
          // console.log('ctx[action.fn](action.params) > action.then: ', action.then)
          // console.log('ctx[action.fn](action.params) > action.fail: ', action.fail)
        }
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
        // console.log('doActionFromContent: ', data, this.modalConfig.on)
        for (let index in this.modalConfig.on) {
          let action = this.modalConfig.on[index]
          if (action.ctx === 'content' && action.fn === data.fn) {
            this.doAction(action.then, data)
            break
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
