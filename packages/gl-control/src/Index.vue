<!--
  基础控件，组件中的一种。
-->
<script>
  import utils from '../../utils/utils'

  let GEELATO_SCRIPT_PREFIX = 'gs:'

  let controlMeta = {
    CheckboxGroup: {defaultValue: [], type: Array}
  }
  export default {
    name: "GlControl",
    props: {
      property: {
        type: Object,
        required: true
      },
      /**
       *  简单表单对象，用于其它属性的值引用及值设置
       *  如果不是用于表单，可以不传入该对象
       */
      form: {
        type: Object,
        default() {
          return {}
        }
      },
      vars: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        values: [],
        model: this.getDefaultValueOfControl(this.property.control)
      }
    },
    watch: {
      model: function (val, oval) {
        console.log('geelato-ui-ant > gl-control > watch > model, val:', val, ',oval:', oval)
        this.$emit('propertyUpdate', {property: this.property, val: val, oval: oval})
      },
      'property.data': {
        handler(val, oval) {
          // 多次watch
          console.log('geelato-ui-ant > gl-control > watch > property.data: ', this.$el, val, oval)
          this.resetArrayDefaultValue()
        },
        // immediate: true,
        // deep: true
      },
      'property.value': {
        handler(val, oval) {
          console.log('geelato-ui-ant > gl-control > watch > property.value, val:', val, ',oval:', oval)
          this.setValue(val)
        },
        // immediate: true,
        // deep: true
      }
    },
    computed: {
      fieldName() {
        return this.property.field
      },
      isReadonly() {
        if (this.property.readOnly === true || this.property.readonly === true) {
          return true
        } else if (typeof this.property.readOnly === 'string' || typeof this.property.readonly === 'string') {
          // 变量计算
          return this.$gl.utils.runJs(this.property.readOnly || this.property.readonly, this.$_ctxLoader())
        }
        return false
      },
    },
    created() {
      this.initDefaultValue()
    },
    mounted() {
      console.log('geelato-ant-ui > gl-control > mounted()')
    },
    updated() {
    },
    methods: {
      getValue() {
        return this.model
      },
      setValue(value) {
        console.log('geelato-ant-ui > gl-control > setValue() > model:', value)
        this.model = value
        this.property.value = value
      },
      /**
       * 级联加载数据
       * */
      loadRefData(value) {
        // console.log('loadRefData...', value)
        const valueType = typeof value
        let v
        if (valueType === "boolean") {
          v = value
        } else if (valueType === 'number') {
          v = value
        } else if (valueType === 'string') {
          v = value
        } else if (value && value.srcElement) {
          v = value.srcElement.value
        } else if (value && value.target && value.target.checked !== undefined) {
          v = value.target.checked
        } else if (value === null || value === undefined) {
          v = ''
        } else {
          console.warn('geelato-ant-ui > gl-control > loadRefData() > unset value:', value)
        }
        this.setValue(v)
        // this.$set(this.form, this.property.gid, v);
        // this.$emit('loadRefData', {property: this.property})
        // this.$emit('change', {property: this.property})
      },
      /**
       * gs(geelato script)执行表达式，若非gs表达式则直接返回
       * @param gs gs:$ctx.form.province
       */
      rungs(str) {
        let that = this
        let $ctx = {form: that.getValues(), vars: {}}
        for (let varName in (that.vars || [])) {
          $ctx.vars[varName] = typeof that.vars[varName] === 'object' ? that.vars[varName].value : that.vars[varName]
        }
        if (str.indexOf(GEELATO_SCRIPT_PREFIX) === 0) {
          return utils.eval(str.substring(3), $ctx)
        } else {
          return str
        }
      },
      /**
       *  设置默认值
       *  默认值有几个属性可以配置，取值的优先顺序是 value > props.defaultValue > props.defaultActiveIndex，按顺序，取到值为止
       */
      initDefaultValue() {
        let that = this
        if (that.property.value) {
          this.model = that.property.value
          return
        }
        if (!that.property.style) {
          that.$set(that.property, 'style', {})
        }

        // 先取属性值
        let value = this.property.value !== undefined ? this.property.value : undefined
        // 若未设置，再取默认值
        if (value === undefined || value === '') {
          value = this.property.props && (this.property.props.defaultValue !== undefined ? this.property.props.defaultValue : undefined)
        }
        // 若未设置，再以索引取默认值
        if ((value === undefined || value === '') && !this.isValueTypeOfArray(this.property.control)) {
          let dataIndex = this.property.props && this.property.props.defaultActiveIndex || 0
          value = this.property.data && this.property.data.length > 0 && this.property.data[dataIndex].value
        }
        // console.log('geelato-ant-ui > gl-control > initDefaultValue()', this.property, this.property.title, value)
        that.setValue(value)
      },
      resetArrayDefaultValue() {
        let that = this
        let value = undefined
        if (!this.isValueTypeOfArray(this.property.control)) {
          let dataIndex = this.property.props && this.property.props.defaultActiveIndex || 0
          value = this.property.data && this.property.data.length > 0 && this.property.data[dataIndex].value
        }
        that.setValue(value)
      },
      getDefaultValueOfControl(controlName) {
        let value = controlMeta[controlName] && controlMeta[controlName].defaultValue
        return value !== undefined ? value : undefined
      },
      isValueTypeOfArray(controlName) {
        return controlMeta[controlName] && controlMeta[controlName].type === Array
      },
      $_ctxLoader() {
        return {form: this.form, vars: this.vars}
      }
    },
    render() {
      let controlDom
      //  转成首字母大写
      let control = ((str) => {
        return str.slice(0, 1).toUpperCase() + str.slice(1)
      })(this.property.control)
      let props = {
        name: this.property.field,
        ref: this.property.gid,
        title: this.property.title,
        placeholder: this.property.placeholder,
        readOnly: this.isReadonly
      }
      let propertyData = this.property.data || []
      let fns = {}
      console.log('geelato-ui-ant > gl-control > render() > props:', props, this.property)
      switch (control) {
        case 'Input':
          controlDom = <a-input type="text" {...{props}} onChange={this.loadRefData}/>
          break;
        case 'Button':
          controlDom = <a-button {...{props}} onChange={this.loadRefData}>{this.property.title}</a-button>
          break
        case 'InputNumber':
          controlDom = <a-input-number type="text" {...{props}} onChange={this.loadRefData}/>
          break;
        case 'Switch':
          controlDom = <a-switch {...{props}} onChange={this.loadRefData}/>
          break;
        case 'DatePicker':
          controlDom = <a-date-picker {...{props}} onChange={this.loadRefData}/>
          break;
        case 'TimePicker':
          controlDom = <a-time-picker {...{props}} onChange={this.loadRefData} use12Hours format="h:mm:ss A"/>
          break;
        case 'Textarea':
          controlDom = <a-textarea {...{props}} onChange={this.loadRefData} row="5"/>
          break;
        case 'Checkbox':
          controlDom = <a-checkbox {...{props}} onChange={this.loadRefData}><span
            style={this.property.style}>{this.property.title}</span></a-checkbox>
          break;
        case 'CheckboxGroup':
          controlDom =
            <a-checkbox-group>
              {
                propertyData.map(item => {
                  return <a-checkbox value={item.value} disabled={item.disabled}>
                    <span style={item.style}>{item.text}</span>
                  </a-checkbox>
                })
              }
            </a-checkbox-group>
          break;
        case 'RadioButton':
          controlDom = <a-radio-group {...{props}}>
            {
              propertyData.map((selectOption, selectOptionKey) => {
                return <a-radio-button key={selectOptionKey} value={selectOption.value}
                                       disabled={selectOption.disabled}>{selectOption.text}</a-radio-button>
              })
            }
          </a-radio-group>
          break;
        case 'Radio':
          controlDom = <a-radio-group {...{props}}>
            {
              propertyData.map((selectOption, selectOptionKey) => {
                return <a-radio key={selectOptionKey} value={selectOption.value}
                                disabled={selectOption.disabled}>{selectOption.text}</a-radio>
              })
            }
          </a-radio-group>
        {
          this.property.placeholder
        }
          break;
        case 'Select':
          controlDom =
            <a-select v-model={this.model} style="min-width: 6em" {...{props}} onChange={this.loadRefData}>
              {
                this.property.props && this.property.props.AddPreOptionText ?
                  <a-select-option value="">{this.property.props.AddPreOptionText}</a-select-option> : ''
              }
              {
                propertyData.map((selectOption, selectOptionKey) => {
                  return <a-select-option key={selectOptionKey} value={selectOption.value}
                                          disabled={selectOption.disabled}>{selectOption.text}</a-select-option>
                })
              }
            </a-select>
          break
        case 'Email':
          controlDom = <a-input type="email" {...{props}} onChange={this.loadRefData}>
            <a-icon slot="prefix" type="mail"/>
          </a-input>
          break
        case 'Password':
          controlDom = <a-input type="password" {...{props}} onChange={this.loadRefData}>
            <a-icon slot='prefix' type='lock'/>
          </a-input>
          break
        case 'Link':
          controlDom = <a>{this.property.title}</a>
          break;
        case 'Title':
          controlDom = <span>{this.property.title}</span>
          break;
        case 'Image':
          controlDom = <div className="ui fluid  image">
            <a className="ui red right corner label">
              <i className="upload icon"></i>
            </a>
          </div>
          break
        case 'Rate':
          controlDom = <a-rate v-model={this.model}/>
          break;
        default:
          controlDom = <a-switch {...{props}} onChange={this.loadRefData}/>
      }

      return (
        <div className="gl-control">
          {controlDom}
        </div>
      )
    }
  }
</script>

<style>
  .gl-control {
    display: inline-block;
    width: 100%
  }
</style>
