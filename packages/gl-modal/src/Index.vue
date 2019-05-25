<template>
  <a-modal
      :title=modalConfig.title
      :width=modalConfig.width || 520
      :okText=modalConfig.okText
      :cancelText=modalConfig.cancelText
      :maskClosable="false"
      :closable="true"
      v-model="modal2Visible"
      @ok="onOK"
  >
    <template slot="footer">
      <!--<a-button key="back" @click="handleCancel">Return</a-button>-->
      <!--<a-button key="submit" type="primary" :loading="loading" @click="handleOk">-->
      <!--Submit-->
      <!--</a-button>-->
    </template>
    <component ref="content" :componentUpdated="isMounted=true" :is="body"
               :opts="modalConfig.body.opts"
               :query="modalConfig.body.query"
               :opener="opener" :modal="thisModal">
      正在加载...
    </component>
  </a-modal>
</template>

<script>
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
        modal2Visible: true
      }
    },
    computed: {
      thisModal() {
        console.log('gl-modal > Index > computed modal: ', this)
        return this
      },
      content() {
        return this.$refs.content
      }
    },
    methods: {
      onOK() {
        this.modal2Visible = false
      }
    }
  }
</script>

<style scoped>

</style>
