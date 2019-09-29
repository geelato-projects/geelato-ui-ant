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
      <div class="gl-list-actions" v-if="action&&action.actions&&action.actions.length>0">
        <a-dropdown>
          <a class="ant-dropdown-link" href="#">
            <a-icon type="ellipsis"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item v-for="(actionItem,index) in action.actions" :key="index">
              <a href="javascript:;" @click="$_doAction(actionItem,item,loadData)">{{actionItem.text}}</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
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
      },
      lazyLoad: {
        type: Boolean,
        default() {
          return false
        }
      },
      query: {
        type: Object,
        default() {
          return {}
        }
      },
      action: {
        type: Object,
        default() {
          return {
            text: '...',
            actions: []
          }
        }
      }
    },
    watch: {
      query: {
        handler(val, oval) {
          this.loadData()
        },
        immediate: true,
        deep: true
      }
    },
    data() {
      return {
        loadingMore: false,
        allData: [],
      }
    },
    mounted() {
      if (!this.lazyLoad) {
        this.loadData()
      }
    },
    methods: {
      /**
       * 加载数据
       * @param <Function> dataHandler 可为空
       */
      loadData(dataHandler) {
        let that = this
        let entityDataReader = JSON.parse(JSON.stringify(that.entityDataReader))
        Object.assign(that.resultSet.resultMapping = {}, that.entityDataReader.resultMapping)
        // 自动转换参数信息
        entityDataReader.params = that.$gl.api.entityDataMappingHandler(this.query, entityDataReader.params)
        console.log('geelato-ui-ant > gl-list > loadData() > entityDataReader.params after convert: ', entityDataReader.params)

        that.$gl.api.queryByEntityDataReader(entityDataReader).then(res => {
          that.$gl.api.resultHandler(res, that.resultSet.resultMapping)
          if (typeof dataHandler === 'function') {
            dataHandler(res)
          } else {
            // 默认数据处理方式
            that.loading = false
            that.allData = res.data
          }
          that.$emit('onLoadData', res.data)
        })
      },
      onLoadMore() {
        this.loadingMore = true
        this.loadData((res) => {
          this.allData = this.allData.concat(res.data.data)
          this.loadingMore = false
          this.$nextTick(() => {
          })
        })
      },
      refresh() {
        this.loadData()
      },
      $_onDeleted() {
        this.loadData()
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

  .gl-list .gl-list-actions {
    display: none;
  }

  .gl-list:hover .gl-list-actions {
    display: block;
  }
</style>
