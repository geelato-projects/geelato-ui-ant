<template>
  <a-form layout="inline">
    <a-row :gutter="gutter">
      <a-col :md="colSpan" :sm="24" v-for="(field,index) in fields" :key="index">
        <!--查询条件中，可能存在同一个字段，多种条件的情况，故entity中用索引作为key，而不用字段名-->
        <template v-if="(!advanced&&index<colPerRow-1)||advanced">
          <a-form-item :label="field.title" v-if="field.type==='string'">
            <a-input v-model="entity[index]" :placeholder="field.placeholder"/>
          </a-form-item>
          <a-form-item :label="field.title" v-if="field.type==='select'">
            <a-select v-model="entity[index]" :placeholder="field.placeholder" default-value="0">
              <a-select-option value="0">全部</a-select-option>
              <a-select-option value="1">关闭</a-select-option>
              <a-select-option value="2">运行中</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label="field.title" v-if="field.type==='number'">
            <a-input-number v-model="entity[index]" style="width: 100%" :placeholder="field.placeholder"/>
          </a-form-item>
          <a-form-item v-if="field.type==='boolean'">
            <a-checkbox v-model="entity[index]" @change="()=>{}">{{field.title}}</a-checkbox>
          </a-form-item>
          <a-form-item :title="field.title" v-if="field.type==='date' && field.control==='range-picker'">
            <a-range-picker v-model="entity[index]" :placeholder="field.placeholder"></a-range-picker>
          </a-form-item>
          <a-form-item :label="field.title" v-else-if="field.type==='date'">
            <a-date-picker v-model="entity[index]" style="width: 100%" :placeholder="field.placeholder"/>
          </a-form-item>
        </template>
      </a-col>
      <a-col :md="colSpan * (colPerRow - fields.length % colPerRow -1)" v-if="advanced">
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

  import utils from '../../utils'
  //  import datetime from '../base/datetime'

  export default {
    props: {
      fields: {
        type: Array,
        default() {
          return []
        },
        required: true
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
        dict: {
          eq: '等于',
          neq: '不等于',
          lt: '小于',
          lte: '小于等于',
          gt: '大于',
          gte: '大于等于',
          sw: '开头包括',
          ew: '结尾包括',
          contains: '包括'
        }
      }
    },
    computed: {
      colSpan() {
        return 24 / this.colPerRow
      },
      isMultiRow() {
        return this.fields.length > this.colPerRow
      }
    },
    mounted: function () {
      this.reset()
    },
    methods: {
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
        console.log('model submit>', e, this.model, this.fields)
        const result = {}
        for (const index in this.fields) {
          const item = this.fields[index]
          // ignore valid field value
          if (this.entity[index] === undefined || this.entity[index] === null) {
            continue
          } else {
            if (item.type === 'boolean') {
              result[item.field + '|' + item.cop] = this.entity[index] ? 1 : 0
            }
            if (item.type === 'date') {
              const moment = this.entity[index]
              if (moment) {
                result[item.field + '|' + item.cop] = moment.format('L')
              }
            } else {
              try {
                const value = utils.trim(this.entity[index])
                if (value === '') {
                  continue
                }
                result[item.field + '|' + item.cop] = value
              } catch (e) {
                console.log('this.entity[index] > ', this.entity[index])
                console.log(e)
              }
            }
          }
        }
        console.log('gl-table > gql查询条件为: ', result)
        this.$emit('input', {value: result, e: e})
      },
      reset() {
        this.entity = {}
        for (const index in this.fields) {
          const item = this.fields[index]
          if (item.type === 'boolean') {
            // notice:the html element can only be change by vm.$set or Vue.set after model created.
            this.$set(this.entity, item.field, utils.toBoolean(item.default))
          } else {
            this.$set(this.entity, item.field, item.default)
          }
        }
      }
    }
  }
</script>
<style scoped>
</style>
