<!--
该组件面向单实体查询，查询条件中，可能存在同一个字段，多种条件的情况，如时间区间查询，故entity中用索引作为key，而不用字段名
-->
<template>
  <a-form layout="inline">
    <a-row :gutter="gutter">
      <a-col :md="colSpan" :sm="24" v-for="(property,index) in properties" :key="index"
             :title="property.title+dict[property.cop]">
        <a-form-item v-show="(!advanced&&index<colPerRow-1)||advanced" :label="property.title">
          <gl-control :ref="property.gid" :property="property" :form="entity" @propertyUpdate="onPropertyUpdate"></gl-control>
        </a-form-item>
      </a-col>
      <a-col :md="colSpan * (colPerRow - properties.length % colPerRow -1)" v-if="advanced">
        <a-form-item>&nbsp;</a-form-item>
      </a-col>
      <a-col :md="colSpan" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="submit">查询</a-button>
              <a-button style="margin-left: 8px" @click="reset">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px" v-if="isMultiRow">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'"/>
              </a>
            </span>
      </a-col>
    </a-row>
  </a-form>
</template>
<script>
  /* eslint-disable no-unneeded-ternary */
  import EntityDataReaderHandler from '../../EntityDataReaderHandler'
  import utils from '../../utils'
  import selectItem from '../../base/selectItems.js'

  export default {
    props: {
      controlRefs: {
        type: Object,
        required: true
      },
      properties: {
        type: Array,
        default() {
          return []
        },
        required: true
      },
      ds: {
        type: Object,
        default() {
          return {}
        }
      },
      colPerRow: {
        type: Number,
        default() {
          return 4
        }
      },
      gutter: {
        type: Number,
        default() {
          return 48
        }
      }
    },
    data() {
      return {
        entity: {},
        // 高级搜索 展开/关闭
        advanced: false,
        defaultValue: {},
        dict: selectItem.copDict,
        gidMap: {},
        entityDataReaderHandler: new EntityDataReaderHandler({
          $gl: this.$gl,
          ds: this.ds,
          dataMountTargetProperties: this.properties,
          ctxLoader: this.ctxLoader
        })
      }
    },
    computed: {
      colSpan() {
        return 24 / this.colPerRow
      },
      isMultiRow() {
        return this.properties.length > this.colPerRow
      }
    },
    mounted() {
      this.initData()
      for (let i in this.$refs) {
        this.controlRefs[i] = this.$refs[i][0]
      }
      console.log('geelato-ui-ant > gl-table > top-query > mounted() > $refs,controlRefs: ', this.$refs, this.controlRefs)
      this.entityDataReaderHandler.execute()
      console.log('geelato-ui-ant > gl-table > top-query > entityDataReaderHandler:', this.entityDataReaderHandler)
    },
    destroyed() {
      for (let i in this.$refs) {
        delete this.controlRefs[i]
      }
      console.log('geelato-ui-ant > gl-table > top-query > destroyed() > $refs,controlRefs: ', this.$refs, this.controlRefs)
    },
    methods: {
      initData() {
        let that = this
        // 转换初始化数据
        for (const index in this.properties) {
          const item = this.properties[index]
          // 检查设置控件维一值
          if (!item.gid) {
            if (!this.gidMap[item.field]) {
              item.gid = item.field
              this.gidMap[item.gid] = item.field
            } else {
              item.gid = item.field + '_' + this.$gl.utils.uuid(8)
              this.gidMap[item.gid] = item.field
            }
          }
        }

        this.reset()
      },
      reset() {
        // 转换初始化数据
        this.entity = {}
        for (const index in this.properties) {
          const item = this.properties[index]
          // 设置查询表单实体值
          // 优先以property.value的值为准，若无则以property.props.defaultValue的值为准，最后以property.props.defaultActiveIndex对应项的值为准
          if (item.value !== undefined) {
            this.$set(this.entity, item.gid, item.value)
          } else if (item.props && item.props.defaultValue !== undefined) {
            this.$set(this.entity, item.gid, item.props.defaultValue)
          } else if (item.props && item.props.defaultActiveIndex !== undefined && item.data && item.data.length > 0) {
            this.$set(this.entity, item.gid, item.data[item.defaultActiveIndex].value)
          }
        }
      },
      onPropertyUpdate({property, val}) {
        this.$set(this.entity, property.gid, val)
        // 该属性值已改变，试着加载级联数据
        this.entityDataReaderHandler.onLoadRefData({property})
      },
      toggleAdvanced() {
        this.advanced = !this.advanced
      },
      convertCop(cop) {
        return this.dict[cop]
      },
      convertLop(o) {
        return o === 'or' ? '或' : '且'
      },
      getPlaceholder(item) {
        if (item.placeholder) {
          return item.placeholder
        } else {
          console.log(item.cop, this.dict[item.cop])
          return this.convertCop(item.cop)
        }
      },
      submit(e) {
        console.log('geelato-ui-ant > gl-table > top-query > submit >e, model, properties', e, this.model, this.properties)
        this.$emit('input', {value: this.getCondition().value, e: e})
      },
      getCondition() {
        const result = {}
        console.log('geelato-ui-ant > gl-table > top-query > getCondition() > before, this.properties>', this.properties)
        for (const index in this.properties) {
          const item = this.properties[index]
          if (this.entity[item.gid] === undefined || this.entity[item.gid] === null) {
            continue
          } else {
            if (item.control === 'checkbox') {
              result[item.field + '|' + item.cop] = this.entity[item.gid] ? 1 : 0
            } else if (item.control === 'date') {
              const moment = this.entity[item.gid]
              if (moment) {
                result[item.field + '|' + item.cop] = moment.format(item.format || 'L')
              }
            } else {
              try {
                const value = typeof this.entity[item.gid] === 'number' ? this.entity[item.gid] : utils.trim(this.entity[item.gid])
                if (value === '') {
                  continue
                }
                result[item.field + '|' + item.cop] = value
              } catch (e) {
                console.log('geelato-ui-ant >  gl-table > top-query > this.entity[item.gid] > ', item, this.entity[item.gid])
                console.log(e)
              }
            }
          }
        }
        console.log('geelato-ui-ant > gl-table > top-query > gql查询条件为: ', result)
        return {value: result}
      },
      ctxLoader() {
        // let $ctx = {form: this.getValues(), vars: {}}
        // for (let varName in (that.vars || [])) {
        //   $ctx.vars[varName] = typeof that.vars[varName] === 'object' ? that.vars[varName].value : that.vars[varName]
        // }
        return this.entity
      }
    }
  }
</script>
<style scoped>
</style>
