<!--
  基础控件，组件中的一种。
-->
<script>
  import mixin from '../../mixin/componentMixin'

  let controlMeta = {
    CheckboxGroup: {defaultValue: [], type: Array}
  }
  export default {
    name: "GlControl",
    mixins: [mixin],
    props: {
      /**
       *  简单表单对象，用于其它属性的值引用及值设置
       *  如果不是用于表单，可以不传入该对象
       */
      form: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        glType: 'control',
        values: [],
        model: this.getDefaultValueOfControl(this.opts.control)
      }
    },
    watch: {
      model: function (val, oval) {
        console.log('geelato-ui-ant > gl-control > watch > model, val:', val, ',oval:', oval)
        this.$emit('propertyUpdate', {property: this.opts, val: val, oval: oval})
      },
      'opts.data': {
        handler(val, oval) {
          // 多次watch
          console.log('geelato-ui-ant > gl-control > watch > opts.data: ', this.$el, val, oval)
          this.resetArrayDefaultValue()
        },
        // immediate: true,
        // deep: true
      },
      'opts.props': {
        handler(val, oval) {
          console.log('geelato-ui-ant > gl-control > watch > opts.props: ', this.$el, val, oval)
          this.resetArrayDefaultValue()
        },
        deep: true
      },
      'opts.value': {
        handler(val, oval) {
          console.log('geelato-ui-ant > gl-control > watch > opts.value:', this.opts.field, ' val:', val, ',oval:', oval)
          this.setValue(val)
        },
        // immediate: true,
        // deep: true
      }
    },
    computed: {
      fieldName() {
        return this.opts.field
      },
      isReadonly() {
        if (this.opts.readOnly === true || this.opts.readonly === true) {
          return true
        } else if (typeof this.opts.readOnly === 'string' || typeof this.opts.readonly === 'string') {
          // 变量计算
          return this.$gl.utils.runJs(this.opts.readOnly || this.opts.readonly, this.$_ctxLoader())
        }
        return false
      },
    },
    created() {
      this.initDefaultValue()
    },
    mounted() {
      console.log('geelato-ui-ant > gl-control > mounted() > opts.field:', this.opts.field, this.opts)
    },
    updated() {
    },
    methods: {
      getValue() {
        return this.model
      },
      setValue(value) {
        console.log('geelato-ui-ant > gl-control > setValue() > model:', value)
        this.model = value
        this.opts.value = value
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
          console.warn('geelato-ui-ant > gl-control > loadRefData() > unset value:', value)
        }
        this.setValue(v)
        // this.$set(this.form, this.opts.gid, v);
        // this.$emit('loadRefData', {property: this.opts})
        // this.$emit('change', {property: this.opts})
      },
      // /**
      //  * gs(geelato script)执行表达式，若非gs表达式则直接返回
      //  * @param gs gs:$ctx.form.province
      //  */
      // rungs(str) {
      //   let that = this
      //   let $ctx = {form: that.getValues(), vars: {}}
      //   for (let varName in (that.vars || [])) {
      //     $ctx.vars[varName] = typeof that.vars[varName] === 'object' ? that.vars[varName].value : that.vars[varName]
      //   }
      //   if (str.indexOf(GEELATO_SCRIPT_PREFIX) === 0) {
      //     return utils.eval(str.substring(3), $ctx)
      //   } else {
      //     return str
      //   }
      // },
      /**
       *  设置默认值
       *  默认值有几个属性可以配置，取值的优先顺序是 value > props.defaultValue > props.defaultActiveIndex，按顺序，取到值为止
       */
      initDefaultValue() {
        let that = this
        if (that.opts.value) {
          this.model = that.opts.value
          return
        }
        if (!that.opts.style) {
          that.$set(that.opts, 'style', {})
        }

        // 先取属性值
        let value = this.opts.value !== undefined ? this.opts.value : undefined
        // 若未设置，再取默认值
        if (value === undefined || value === '') {
          value = this.opts.props && (this.opts.props.defaultValue !== undefined ? this.opts.props.defaultValue : undefined)
        }
        // 若未设置，再以索引取默认值
        if ((value === undefined || value === '') && !this.isValueTypeOfArray(this.opts.control)) {
          let dataIndex = this.opts.props && (this.opts.props.defaultActiveIndex || 0)
          value = this.opts.data && this.opts.data.length > 0 && this.opts.data[dataIndex].value
        }
        // console.log('geelato-ui-ant > gl-control > initDefaultValue()', this.opts, this.opts.title, value)
        that.setValue(value)
      },
      resetArrayDefaultValue() {
        let that = this
        let value = undefined
        if (!this.isValueTypeOfArray(this.opts.control)) {
          if (this.opts.data && this.opts.data.length > 0) {
            let dataIndex = this.opts.props && (this.opts.props.defaultActiveIndex || 0)
            value = this.opts.data[dataIndex].value
          }
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
      onClick($event) {
        // console.log('..........onClick', this.$refs[this.opts.gid])
        this.$emit('click', {$event, $control: this})
      },
      $_ctxLoader() {
        return {form: this.form, vars: this.vars, params: this.params}
      },
      changeBooleanToNumber() {
        if (this.model === true) {
          this.model = 1
        } else if (this.model === false) {
          this.model = 0
        }
      }
    },
    render() {
      let controlDom
      //  转成首字母大写
      let control = ((str) => {
        return str.slice(0, 1).toUpperCase() + str.slice(1)
      })(this.opts.control)
      this.opts.gid = this.opts.gid || this.$gl.utils.uuid(16)
      let gid = this.opts.gid
      let props = {
        name: this.opts.field,
        ref: this.opts.gid,
        title: this.$gl.i18n.tproxy(this.opts.titleI18n, this.opts.title),
        placeholder: this.opts.props ? this.$gl.i18n.tproxy(this.opts.props.placeholderI18n, this.opts.props.placeholder) : undefined,
        readOnly: this.isReadonly
      }
      let propertyData = this.opts.data || []
      let fns = {}
      console.log('geelato-ui-ant > gl-control > render() > props:', props, this.opts)
      // 新版 vue-cli4 中，已经默认集成了 JSX 语法对 v-model 的支持，可以直接使用 <input v-model={this.value}>
      // 如果项目比较老，也可以安装插件 babel-plugin-jsx-v-model 来进行支持
      switch (control) {
        case 'Input':
          controlDom = <a-input type="text" v-model={this.model} {...{props}} onChange={this.loadRefData}/>
          break;
        case 'Button':
          controlDom =
            <a-button {...{props}} v-model={this.model} onChange={this.loadRefData}>{this.opts.title}</a-button>
          break
        case 'InputNumber':
          controlDom = <a-input-number type="text" v-model={this.model} {...{props}} onChange={this.loadRefData}/>
          break;
        case 'Switch':
          controlDom = <a-switch {...{props}} v-model={this.model} onChange={this.loadRefData}/>
          break;
        case 'DatePicker':
          controlDom = <a-date-picker {...{props}} v-model={this.model} onChange={this.loadRefData}/>
          break;
        case 'TimePicker':
          controlDom =
            <a-time-picker {...{props}} v-model={this.model} onChange={this.loadRefData} use12Hours format="h:mm:ss A"/>
          break;
        case 'Textarea':
          controlDom = <a-textarea {...{props}} v-model={this.model} onChange={this.loadRefData} row="5"/>
          break;
        case 'Checkbox':
          controlDom = <a-checkbox {...{props}} v-model={this.model} onChange={this.loadRefData}><span
            style={this.opts.style}>{this.opts.title}</span></a-checkbox>
          break;
        case 'CheckboxGroup':
          controlDom =
            <a-checkbox-group v-model={this.model}>
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
          controlDom = <a-radio-group v-model={this.model} {...{props}}>
            {
              propertyData.map((selectOption, selectOptionKey) => {
                return <a-radio-button key={selectOptionKey} value={selectOption.value}
                                       disabled={selectOption.disabled}>{selectOption.text}</a-radio-button>
              })
            }
          </a-radio-group>
          break;
        case 'Radio':
          controlDom = <a-radio-group v-model={this.model}  {...{props}}>
            {
              propertyData.map((selectOption, selectOptionKey) => {
                return <a-radio key={selectOptionKey} value={selectOption.value}
                                disabled={selectOption.disabled}>{selectOption.text}</a-radio>
              })
            }
          </a-radio-group>
        {
          this.opts.placeholder
        }
          break;
        case 'Select':
          this.changeBooleanToNumber()
          controlDom =
            <a-select v-model={this.model} style="min-width: 6em" {...{props}} onChange={this.loadRefData}>
              {
                this.opts.props && this.opts.props.AddPreOptionText ?
                  <a-select-option value="">{this.opts.props.AddPreOptionText}</a-select-option> : ''
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
          controlDom = <a-input type="email" v-model={this.model}  {...{props}} onChange={this.loadRefData}>
            <a-icon slot="prefix" type="mail"/>
          </a-input>
          break
        case 'Password':
          controlDom = <a-input v-model={this.model} type="password" {...{props}} onChange={this.loadRefData}>
            <a-icon slot='prefix' type='lock'/>
          </a-input>
          break
        case 'Link':
          controlDom = <a>{this.opts.title}</a>
          break;
        case 'Title':
          controlDom = <span>{this.opts.title}</span>
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
          controlDom = <span></span>
      }

      return (
        <div ref={gid} className="gl-control" onClick={this.onClick}>
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
