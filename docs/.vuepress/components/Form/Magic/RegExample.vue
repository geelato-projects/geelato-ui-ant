<template>
  <div>
    <a-button type="primary" @click="reset">重置表单</a-button>
    <a-button type="primary" @click="validate">校验表单</a-button>
    <a-button type="primary" @click="getValues">{{showFormValue?'隐藏表单值':'获取表单值'}}</a-button>
    <a-button type="primary" @click="getGql">{{showGQL?'隐藏保存GQL':'获取保存GQL'}}</a-button>
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
    <gl-magic-form ref="magicForm" :opts="config"></gl-magic-form>
  </div>
</template>

<script>
  import RegData from './RegData.js'

  export default {
    name: "RegExample",
    data() {
      return {
        config: RegData,
        formData: {},
        GQLData: {},
        showFormValue: false,
        showGQL: false
      }
    },
    methods: {
      reset() {
        this.$refs.magicForm.reset(RegData)
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
        this.$refs.magicForm.validate(RegData)
      }
    }
  }
</script>

<style scoped>
  button {
    margin: 0.5em 0;
  }
</style>
