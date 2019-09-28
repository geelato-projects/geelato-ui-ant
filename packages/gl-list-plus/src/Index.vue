<template>
  <div class="gl-list-plus" style="background-color: #FFFFFF; margin: 20px;">
    <a-row :gutter="16">
      <a-col :span="6">
        <a-card class="gl-list-card" :bordered=false>
          <span href="#" slot="title">
            <a-icon type="project" theme="filled" style="margin-right: 4px"/>
            {{listTitle}}
            </span>
          <a href="#" slot="extra">
            <a-dropdown v-if="listAction&&listAction.actions&&listAction.actions.length>0">
              <a class="ant-dropdown-link" href="#">
                <!--{{listAction.title}}-->
                <a-icon type="ellipsis" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-for="(action,index) in listAction.actions" :key="index">
                  <a href="javascript:;" @click="doAction(action,{})">{{action.text}}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a>
          <div v-if="listSearch">
            <a-input :placeholder="listSearch.placeholder">
              <a-icon slot="prefix" type="search" style="color: rgba(0,0,0,.25)"/>
            </a-input>
          </div>
          <div class="gl-list-group" v-for="(groupItem,index) in listGroupAllData" :key="index"
               style="padding-bottom: 1px">
            <div class="gl-list-group-header">
              <span style="cursor: pointer">
                <a-icon type="minus-square" v-if="groupItem.isOpened===true" @click="$set(groupItem,'isOpened',false)"/>
                <a-icon type="plus-square" v-if="groupItem.isOpened!==true" @click="$set(groupItem,'isOpened',true)"/>
              </span>
              <a-icon v-if="listGroupIcon.type" :type="listGroupIcon.type" :theme="listGroupIcon.theme"
                      :twoToneColor="listGroupIcon.twoToneColor" style="margin:0 0.1em 0 0.3em"/>
              {{groupItem.title}}
              <span style="float: right">
                <a-dropdown
                    v-if="listGroupItemAction&&listGroupItemAction.actions&&listGroupItemAction.actions.length>0">
                  <a class="ant-dropdown-link" href="#">
                    <a-icon type="ellipsis" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(action,index) in listGroupItemAction.actions" :key="index">
                      <a href="javascript:;" @click="doAction(action,groupItem)">{{action.text}}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
            </div>
            <gl-list v-if="groupItem.isOpened" v-bind="listConfig"
                     @selectItem="(item)=>{selectedItem = item}"></gl-list>
          </div>
        </a-card>
      </a-col>
      <a-col :span="18">
        <!--<a-card :title="plusTitle" :bordered=false>-->
        <!--</a-card>-->
        <gl-card-layout v-if="plusPage" :cardMap="plusPage.cardMap" :layout="plusPage.layout"></gl-card-layout>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import mixin from '../../mixin'

  export default {
    name: 'GlListPlus',
    mixins: [mixin],
    components: {},
    props: {
      listTitle: {
        type: String,
        default() {
          return '列表'
        }
      },
      listAction: Object,
      listSearch: {
        type: Object
      },
      listClazz: {
        type: String,
        default() {
          return ''
        }
      },
      listGroupIcon: {
        type: Object,
        default() {
          return {}
        }
      },
      listGroupItemAction: {type: Object},
      listLoading: {
        type: Boolean,
        default() {
          return false
        }
      },
      listShowLoadingMore: {
        type: Boolean,
        default() {
          return false
        }
      },
      listEntityDataReader: {
        type: Object,
        required: true
      },
      listGroupEntityDataReader: {
        type: Object,
        required: true
      },
      plusTitle: {
        type: String,
        default() {
          return '详情'
        }
      },
      plusPage: {
        type: Object
      }
    },
    data() {
      return {
        listConfig: {
          entityDataReader: this.listEntityDataReader,
          clazz: this.listClazz,
          loading: this.listLoading,
          showLoadingMore: this.listShowLoadingMore
        },
        listGroupAllData: [],
        listGroupResultSet: {
          data: [],
          // 解析之后的resultMapping，值为data中对应的列名
          resultMapping: {
            // 头像url
            // avatarUrl: 'avatarUrl',
            // title: 'name',
            // content: 'code',
            // description: 'description'
          }
        }
      }
    },
    mounted() {
      this.refresh()
    },
    methods: {
      loadData(params, dataHandler) {
        let that = this
        let listGroupEntityDataReader = that.listGroupEntityDataReader
        listGroupEntityDataReader.params = params || {}
        Object.assign(that.listGroupResultSet.resultMapping = {}, that.listGroupEntityDataReader.resultMapping)

        that.$gl.api.queryByEntityDataReader(listGroupEntityDataReader).then(res => {
          that.$gl.api.resultHandler(res, that.listGroupResultSet.resultMapping)
          if (typeof dataHandler === 'function') {
            dataHandler(res)
          }
        })
      },
      refresh() {
        console.log('refresh...')
        this.loadData({}, (res) => {
          console.log('geelato-ui-ant > gl-list-plus > mounted() > typeof dataHandler >', res)
          // this.loading = false
          this.listGroupAllData = res.data
          // 初始化展开第一项
          if (this.listGroupAllData && this.listGroupAllData.length > 0) {
            this.$set(this.listGroupAllData[0], 'isOpened', true)
          }
        })
      },
      selectItem(item, index) {
        console.log('geelato-ui-ant > gl-list > Index > selectItem() > item:', item, '  index:', index)
        this.$emit('doAction', {fn: 'selectItem', item: item, index: index})
      }
    }
  }
</script>

<style>
  .gl-list-plus .ant-card-body {
    padding: 4px 2px;
  }

  .gl-list-plus .ant-card-head-title {
    font-weight: 500;
  }

  .gl-list-plus .gl-list-card .ant-card-head {
    padding: 0 8px;
  }

  .gl-list-plus .gl-list-group-header {
    padding: 0.2em 0.8em 0.4em;
    font-weight: 700;
    line-height: 1.2em;
    background-color: #ececec;
  }

  .gl-list-plus .gl-list-group-header:hover {
    background-color: #e5e5e5;
  }

  /*有分组时，列表需缩进*/
  .gl-list-group .ant-list-item {
    padding-left: 2em;
  }

  .gl-list-plus .anticon.anticon-ellipsis {
    font-size: 20px;
    color: #000000;
  }

</style>
