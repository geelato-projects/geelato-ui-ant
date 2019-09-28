<template>
  <a-list
      class="gl-list"
      :class=clazz
      :loading="loading"
      itemLayout="horizontal"
      :dataSource="allData"
  >
    <div v-if="showLoadingMore" slot="loadMore"
         :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
      <a-spin v-if="loadingMore"/>
      <a-button v-else @click="onLoadMore">加载更多</a-button>
    </div>
    <a-list-item slot="renderItem" slot-scope="item, index" :title="resultSet.resultMapping.tips?item.tips:''">
      <!--<a slot="actions">edit</a>-->
      <!--<a slot="actions">more</a>-->
      <a-list-item-meta :description="resultSet.resultMapping.description?item.description:''">
        <a slot="title" @click="selectItem(item,index)">{{item.title}}</a>
        <a-avatar v-if="entityDataReader.resultMapping.avatarUrl&&resultSet.resultMapping.avatarUrl" slot="avatar"
                  :src="item.avatarUrl"/>
      </a-list-item-meta>
      <div v-if="entityDataReader.resultMapping.content">{{item.content}}</div>
    </a-list-item>
  </a-list>
</template>

<script>
  import mixin from '../../mixin'

  export default {
    name: 'GlList',
    mixins: [mixin],
    components: {},
    props: {
      clazz: {
        type: String,
        default() {
          return ''
        }
      },
      loading: {
        type: Boolean,
        default() {
          return false
        }
      },
      showLoadingMore: {
        type: Boolean,
        default() {
          return false
        }
      }
    },
    data() {
      return {
        loadingMore: false,
        allData: [],
      }
    },
    mounted() {
      this.loadData({}, (res) => {
        console.log('geelato-ui-ant > typeof dataHandler >', res)
        this.loading = false
        this.allData = res.data
      })
    },
    methods: {
      loadData(params, dataHandler) {
        let that = this
        let entityDataReader = that.entityDataReader
        entityDataReader.params = params || {}
        Object.assign(that.resultSet.resultMapping = {}, that.entityDataReader.resultMapping)

        that.$gl.api.queryByEntityDataReader(entityDataReader).then(res => {
          that.$gl.api.resultHandler(res, that.resultSet.resultMapping)
          if (typeof dataHandler === 'function') {
            dataHandler(res)
          }
        })
      },
      onLoadMore() {
        this.loadingMore = true
        this.loadData({}, (res) => {
          this.allData = this.allData.concat(res.data.data)
          this.loadingMore = false
          this.$nextTick(() => {
            // window.dispatchEvent(new Event('resize'))
          })
        })
      },
      /**
       *  用于ide自动解析可配置信息
       *  getEntityBindSettings为实体绑定专用方法
       * @returns {{title: {type: StringConstructor}, description: {type: StringConstructor}}}
       */
      getEntityBindSettings() {
        return {
          title: {
            name: '标题',
            type: String
          },
          description: {
            name: '描述',
            type: String
          }
        }
      },
      selectItem(item, index) {
        console.log('geelato-ui-ant > gl-list > Index > selectItem() > item:', item, '  index:', index)
        this.$emit('doAction', {fn: 'selectItem', item: item, index: index})
      }
    }
  }
</script>

<style>
  .gl-list .ant-list-item:hover {
    background-color: #f5f5f5;
    cursor: default;
  }
</style>
