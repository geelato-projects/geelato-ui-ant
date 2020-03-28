<template>
  <div class="gl-control">
    <template v-if="property.control==='input'">
      <a-input type="text" :name="getFieldNameByCell(property)" v-model="model" :readOnly="isReadonly(property)"
               v-bind="property.props"/>
    </template>
    <template v-else-if="property.control==='date'">
      <a-date-picker @change='loadRefData(property, $event)' :name="getFieldNameByCell(property)" v-model="model"
                     :readOnly="isReadonly(property)"
                     v-bind="property.props"/>
    </template>
    <template v-else-if="property.control==='time'">
      <a-time-picker use12Hours format="h:mm:ss A"
                     :name="getFieldNameByCell(property)"
                     v-model="model" :readOnly="isReadonly(property)"
                     v-bind="property.props"
                     @change='loadRefData(property, $event)'/>
    </template>
    <template v-else-if="property.control==='textarea'">
      <a-textarea rows="5" :name="getFieldNameByCell(property)"
                  v-model="model" :readOnly="isReadonly(property)"
                  v-bind="property.props"
                  @change='loadRefData(property, $event)'></a-textarea>
    </template>
    <template v-else-if="property.control==='checkbox'">
      <a-checkbox :name="getFieldNameByCell(property)" :defaultChecked="model?true:false"
                  @change="(e)=>{model = e.target.checked;loadRefData(property, $event)}"
                  :readOnly="isReadonly(property)"
                  v-bind="property.props">{{property.placeholder}}
      </a-checkbox>
    </template>
    <template v-else-if="property.control==='radio'">
      <a-radio-group :defaultValue="property.value" v-model="model" @change='loadRefData(property, $event)'>
        <a-radio v-for="(radioItem,radioItemKey) in property.data" :key="radioItemKey"
                 :value="radioItem.value">{{radioItem.text}}
        </a-radio>
      </a-radio-group>
      {{property.placeholder}}
      <!--<template v-for="radioItem in property.data">-->
      <!--<sui-checkbox radio :label="radioItem.text" :name="getFieldNameByCell(property)"-->
      <!--v-model="model"-->
      <!--:value="radioItem.value"-->
      <!--:readOnly="isReadonly(property)"-->
      <!--v-bind="property.props"></sui-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;-->
      <!--</template>-->
    </template>
    <template v-else-if="property.control==='select'">
      <a-select v-model="model" style="min-width: 6em" @change='loadRefData(property, $event)'
                :ref="getFieldNameByCell(property)"
                :readOnly="isReadonly(property)" v-bind="property.props">
        <a-select-option value="" v-if="property.props&&property.props.AddPreOptionText">
          {{property.props.AddPreOptionText}}
        </a-select-option>
        <a-select-option v-for="(selectOption,selectOptionKey) in property.data" :key="selectOptionKey"
                         :value="selectOption.value" :disabled="selectOption.disabled">{{selectOption.text}}
        </a-select-option>
      </a-select>
    </template>
    <template v-else-if="property.control==='image'">
      <div class="ui fluid  image">
        <a class="ui red right corner label">
          <i class="upload icon"></i>
        </a>
        <!--<img class="ui small rounded image" style=""-->
        <!--src="../../assets/images/avatar/large/jenny.jpg">-->
      </div>
      <!--<div class="ui placeholder">-->
      <!--<a class="ui red right corner label" @click="uploadImage">-->
      <!--<i class="upload icon"></i>-->
      <!--</a>-->
      <!--<div class="rectangular image"></div>-->
      <!--</div>-->
    </template>
    <template v-else-if="property.control==='email'">
      <a-input type="email" :name="getFieldNameByCell(property)"
               v-model="model" :readOnly="isReadonly(property)"
               v-bind="property.props"
               @change='loadRefData(property, $event)'>
        <a-icon slot="prefix" type="mail"/>
      </a-input>
    </template>
    <template v-else-if="property.control==='password'">
      <a-input :name="getFieldNameByCell(property)"
               v-model="model" :readOnly="isReadonly(property)"
               v-bind="property.props" type="password"
               @change='loadRefData(property, $event)'>
        <a-icon slot="prefix" type="lock"/>
        <!--<a-icon v-if="userName" slot="suffix" type="close-circle" @click="emitEmpty" />-->
      </a-input>
    </template>
    <template v-else-if="property.control==='button'">
      <a-button v-bind="property.props" :readOnly="isReadonly(property)">{{property.title}}</a-button>
    </template>
    <template v-else>
      {{form[getFieldNameByCell(property)]}}
    </template>
  </div>
</template>

<script>
  import utils from '../../utils'

  let GEELATO_SCRIPT_PREFIX = 'gs:'

  export default {
    name: "GlControl",
    props: {
      property: {
        type: Object,
        required: true
      },
      form: {
        type: Object
      }
    },
    data() {
      return {
        model: this.property.value !== undefined ? this.property.value : (this.property.props ? this.property.props.defaultValue : undefined),
        boolValue: false
      }
    },
    watch: {
      model: function (val, oval) {
        // console.log('geelato-ui-ant > gl-control > watch > model: ', val, oval)
        this.$emit('propertyUpdate', {property: this.property, val: val, oval: oval})
      },
      'property.data': {
        handler(val, oval) {
          // 多次watch
          console.log('geelato-ui-ant > gl-control > watch > property.data: ', this.$el, val, oval)
          this.resetDefaultValue()
        },
        // immediate: true,
        // deep: true
      }
    },
    mounted() {
    },
    updated() {
    },
    methods: {
      getValue() {
        return this.model
      },
      setValue(value) {
        this.model = value
      },
      getFieldNameByCell(property) {
        return property.field
      },
      isReadonly(property) {
        if (property.readonly === true) {
          return true
        } else if (typeof property.readonly === 'string') {
          // return this.rungs(property.readonly)
        }
        return false
      },
      /**
       * 级联加载数据
       * */
      loadRefData(property, value) {
        this.$set(this.form, property.gid, value);
        // console.log('geelato-ui-ant > GLControl.vue > loadRefData() > property,value:', this.property, value)
        this.$emit('loadRefData', {property: this.property})
      },
      /**
       * gs(geelato script)执行表达式，若非gs表达式则直接返回
       * @param gs gs:$ctx.form.province
       */
      rungs(str) {
        let thisVue = this
        let $ctx = {form: thisVue.getValues(), vars: {}}
        for (let varName in (thisVue.vars || [])) {
          $ctx.vars[varName] = typeof thisVue.vars[varName] === 'object' ? thisVue.vars[varName].value : thisVue.vars[varName]
        }
        if (str.indexOf(GEELATO_SCRIPT_PREFIX) === 0) {
          return utils.eval(str.substring(3), $ctx)
        } else {
          return str
        }
      },
      resetDefaultValue() {
        let that = this
        if (that.property.value) {
          return
        }
        // 设置默认值，如select控件
        // if (this.property.props && this.property.props.defaultActiveIndex !== undefined && this.property.data && this.property.data.length > 0) {
        //   this.model = this.property.data[this.property.props.defaultActiveIndex].value
        // } else if (this.property.props && this.property.props.defaultActiveIndex === undefined && this.property.data && this.property.data.length > 0) {
        //   this.model = this.property.data[0].value
        // }

        if (that.property.props && that.property.data && that.property.data.length > 0) {
          let dataIndex = that.property.props.defaultActiveIndex || 0
          that.model = that.property.data[dataIndex].value
        }
      }
    }
  }
</script>

<style>
  .gl-control {
    display: inline-block;
    width: 100%
  }
</style>
