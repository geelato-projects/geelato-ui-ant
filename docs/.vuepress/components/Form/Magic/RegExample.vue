<template>
  <div>
    <a-button type="primary" @click="setI18nLanguage($i18n.locale==='zh-CN'?'en-US':'zh-CN')">切换为{{$i18n.locale==='zh-CN'?'English':'中文'}}</a-button>
    <a-button type="primary" @click="reset">重置表单</a-button>
    <a-button type="primary" @click="validate">校验表单</a-button>
    <a-button type="primary" @click="getValues">{{showFormValue?'隐藏表单值':'获取表单值'}}</a-button>
    <a-button type="primary" @click="getGql">{{showGQL?'隐藏保存GQL':'获取保存GQL'}}</a-button>
    <a-button type="primary" @click="genRefs">创建表单内的控件引用</a-button>
    <a-alert v-if="showFormValue&&formData&&Object.keys(formData).length>0" style="margin-bottom: 4px">
      <span slot="description">
        {{formData}}
      </span>
    </a-alert>
    <a-alert v-if="showGQL&&GQLData&&Object.keys(GQLData).length>0" style="margin-bottom: 4px">
      <span slot="description">
        {{GQLData}}
      </span>
    </a-alert>
    <gl-form gid="hywjsunjsyy81hjaiyahh" ref="magicForm" v-bind="config.bind" @propertyUpdate="onPropertyUpdate"
             @doAction="onAction"></gl-form>
    <!--<component :is="xform" :opts="config" @doAction="onAction">-->
    <!--</component>-->
  </div>
</template>

<script>
  import RegData from './RegData4.js'
  import {setI18nLanguage} from '../../../locales/index'
  export default {
    name: "RegExample",
    component: {},
    data() {
      return {
        config: RegData,
        formData: {},
        GQLData: {},
        showFormValue: false,
        showGQL: false,
        // xform: XForm
      }
    },
    methods: {
      setI18nLanguage(lang){
        setI18nLanguage(lang)
      },
      reset() {
        this.$refs.magicForm.reset(RegData.bind)
      },
      genRefs() {
        console.log(this.$refs.magicForm.$_getRefControlByGid('name'))
      },
      getGql() {
        this.showGQL = !this.showGQL
        if (this.showGQL) {
          this.GQLData = this.$refs.magicForm.getGql(RegData)
        }
      },
      getValues() {
        this.showFormValue = !this.showFormValue
        if (this.showFormValue) {
          this.formData = this.$refs.magicForm.getValues()
        }
      },
      validate() {
        this.$refs.magicForm.validate(RegData).then(function (res) {
        }).catch(function (e) {
        })
      },
      onPropertyUpdate({property, val, oval}) {
        console.log('Example > onPropertyUpdate() >property, val, oval:', property, val, oval)
      },
      onAction(data) {
        console.log('Example > onAction() > data:>', data)
      }
    }
  }
</script>

<style scoped>
  button {
    margin: 0.5em 0;
  }
</style>
