<template>
  <div>
    <template v-if="property.control==='input'">
      <a-input type="text" :placeholder="property.placeholder" :name="getFieldNameByCell(property)"
               v-model="model" :readOnly="isReadonly(property)"
               :disabled="property.disabled===true"/>
    </template>
    <template v-else-if="property.control==='date'">
      <a-date-picker @change="onChange" :placeholder="property.placeholder" :name="getFieldNameByCell(property)"
                     v-model="model" :readOnly="isReadonly(property)"
                     :disabled="property.disabled===true"/>
    </template>
    <template v-else-if="property.control==='time'">
      <a-time-picker use12Hours format="h:mm:ss A" :placeholder="property.placeholder"
                     :name="getFieldNameByCell(property)"
                     v-model="model" :readOnly="isReadonly(property)"
                     :disabled="property.disabled===true"/>
    </template>
    <template v-else-if="property.control==='textarea'">
      <a-textarea rows="5" :placeholder="property.placeholder" :name="getFieldNameByCell(property)"
                  v-model="model" :readOnly="isReadonly(property)"
                  :disabled="property.disabled===true"></a-textarea>
    </template>
    <template v-else-if="property.control==='checkbox'">
      <a-checkbox :name="getFieldNameByCell(property)" v-model="model"
                  :readOnly="isReadonly(property)"
                  :disabled="property.disabled===true">{{property.placeholder}}
      </a-checkbox>
    </template>
    <template v-else-if="property.control==='radio'">
      <a-radio-group :defaultValue="property.value" v-model="model">
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
      <!--:disabled="property.disabled===true"></sui-checkbox>&nbsp;&nbsp;&nbsp;&nbsp;-->
      <!--</template>-->

    </template>
    <template v-else-if="property.control==='select'">
      <!--{{property.value}}-->
      <a-select v-model="model" width="100%"
                @change='$set(form,getFieldNameByCell(property),$event);loadRefData(property, "")'
                :ref="getFieldNameByCell(property)"
                :readOnly="isReadonly(property)" :disabled="property.disabled===true">
        <a-select-option v-for="(selectOption,selectOptionKey) in property.data" :key="selectOptionKey"
                         :value="selectOption.value">{{selectOption.text}}
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
      <a-input type="email" :placeholder="property.placeholder" :name="getFieldNameByCell(property)"
               v-model="model" :readOnly="isReadonly(property)"
               :disabled="property.disabled===true">
        <a-icon slot="prefix" type="mail"/>
      </a-input>
    </template>
    <template v-else-if="property.control==='password'">
      <a-input :placeholder="property.placeholder" :name="getFieldNameByCell(property)"
               v-model="model" :readOnly="isReadonly(property)"
               :disabled="property.disabled===true" type="password">
        <a-icon slot="prefix" type="lock"/>
        <!--<a-icon v-if="userName" slot="suffix" type="close-circle" @click="emitEmpty" />-->
      </a-input>
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
    name: "gl-control",
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
        model: this.property.value
      }
    },
    // computed: {
    //   selectItem() {
    //     if (typeof this.property.defaultActiveIndex === 'number') {
    //
    //     }
    //   }
    // },
    watch: {
      model: function (val, oval) {
        this.$emit('propertyUpdate', {property: this.property, val: val, oval: oval})
      },
      property: {
        handler(val, oval) {
          if (typeof this.property.defaultActiveIndex === 'number') {
            this.model = this.property.data[this.property.defaultActiveIndex].value
          }
        },
        // immediate: true,
        deep: true
      }
    },
    methods: {
      getValue() {
        return this.model
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
      loadRefData() {
        console.log('control > loadRefData', this.property)
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
    }
  }
</script>

<style scoped>

</style>
