<template>
  <a-list
      :class=clazz
      :loading="loading"
      itemLayout="horizontal"
      :dataSource="data"
  >
    <div v-if="showLoadingMore" slot="loadMore"
         :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }">
      <a-spin v-if="loadingMore"/>
      <a-button v-else @click="onLoadMore">加载更多</a-button>
    </div>
    <a-list-item slot="renderItem" slot-scope="item, index">
      <!--<a slot="actions">edit</a>-->
      <!--<a slot="actions">more</a>-->
      <a-list-item-meta
          :description="resultSet.resultMapping.description?item[resultSet.resultMapping.description]:''">
        <a slot="title" href="#">{{item[resultSet.resultMapping.title]}}</a>
        <a-avatar v-if="resultSet.resultMapping.avatarUrl" slot="avatar"
                  :src="item[resultSet.resultMapping.avatarUrl]"/>
      </a-list-item-meta>
      <div>{{item[resultSet.resultMapping.content]}}</div>
    </a-list-item>
  </a-list>
</template>

<script>
  import mixin from '../../mixin'

  export default {
    name: 'gl-list',
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
      entityDataSource: {
        type: Object,
        required: true,
        default() {
          return {
            entityName: '',
            fieldNames: '',
            withMeta: false,
            resultMapping: {
              // 头像url
              avatarUrl: '',
              title: '',
              code: '',
              description: ''
            },
            vars: {}
          }
        }
      }
    },
    data() {
      return {
        loadingMore: false,
        data: [],
      }
    },
    mounted() {
      this.loadData({}, (res) => {
        this.loading = false
        console.log('res>', res)
        this.data = res.data.data
      })
    },
    methods: {
      // loadData(params, dataHandler) {
      //   let bindEntity = this.entityDataSource
      //   let gql = {}
      //   gql[bindEntity.entityName] = {
      //     '@fs': bindEntity.fieldNames || '*'
      //   }
      //   Object.assign(gql[bindEntity.entityName], params || {})
      //   this.api.queryByGql(gql, bindEntity.withMeta).then(res => {
      //     dataHandler(res)
      //   })
      // },

      onLoadMore() {
        this.loadingMore = true
        this.loadData({}, (res) => {
          this.data = this.data.concat(res.results)
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
      }
    }
  }
</script>

<style scoped>
</style>
