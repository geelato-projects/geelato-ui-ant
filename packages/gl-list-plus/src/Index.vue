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
            <a-dropdown v-if="listHeaderAction&&listHeaderAction.actions&&listHeaderAction.actions.length>0">
              <a class="ant-dropdown-link" href="#">
                <!--{{listHeaderAction.title}}-->
                <a-icon type="ellipsis"/>
              </a>
              <a-menu slot="overlay">
                <a-menu-item v-for="(action,index) in listHeaderAction.actions" :key="index">
                  <a href="javascript:;" @click="$_doAction(action,{})">{{action.text}}</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </a>
          <!--<div v-if="listSearch">-->
          <!--<a-input :placeholder="listSearch.placeholder">-->
          <!--<a-icon slot="prefix" type="search" style="color: rgba(0,0,0,.25)"/>-->
          <!--</a-input>-->
          <!--</div>-->
          <div style="text-align: center;padding: 0.5em" v-if="!listGroupAllData||listGroupAllData.length===0">
            **没有数据***
          </div>
          <div class="gl-list-group" v-for="(groupItem,groupItemIndex) in listGroupAllData" :key="groupItemIndex"
               style="padding-bottom: 1px">
            <div class="gl-list-group-header">
              <span style="cursor: pointer">
                <a-icon type="minus-square" v-if="groupItem.isOpened===true"
                        @click="closeGroupItem(groupItem,groupItemIndex)"/>
                <a-icon type="plus-square" v-if="groupItem.isOpened!==true"
                        @click="openGroupItem(groupItem,groupItemIndex)"/>
              </span>
              <a-icon v-if="listGroupIcon.type" :type="listGroupIcon.type" :theme="listGroupIcon.theme"
                      :twoToneColor="listGroupIcon.twoToneColor" style="margin:0 0.1em 0 0.3em"/>
              {{groupItem.title}}
              <span style="float: right">
                <a-dropdown
                    v-if="listGroupAction&&listGroupAction.actions&&listGroupAction.actions.length>0">
                  <a class="ant-dropdown-link" href="#">
                    <a-icon type="ellipsis"/>
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item v-for="(action,index) in listGroupAction.actions" :key="index">
                      <a href="javascript:;"
                         @click="currentGroupItem=groupItem;currentGroupItemIndex=index;$_doAction(action,groupItem)">{{action.text}}</a>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </span>
            </div>
            <gl-list v-if="groupItem.isOpened" v-bind="listConfig" :query="groupItem.query"
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
      listHeaderAction: Object,
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
      listGroupAction: {type: Object},
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
          action: this.listGroupItemAction,
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
        },
        currentGroupItem: {},
        currentGroupItemIndex: 0
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
      closeGroupItem(groupItem) {
        this.$set(groupItem, 'isOpened', false)
      },
      openGroupItem(groupItem) {
        this.$set(groupItem, 'query', groupItem)
        this.$set(groupItem, 'isOpened', true)
      },
      $_onDeleted(params, data) {
        this.refresh()
      },
      refresh() {
        let that = this
        that.loadData({}, (res) => {
          console.log('geelato-ui-ant > gl-list-plus > mounted() > typeof dataHandler >', res)
          // this.loading = false
          // this.$nextTick()
          that.listGroupAllData = res.data
          // 初始化展开第一项
          if (that.listGroupAllData && this.listGroupAllData.length > 0) {
            that.openGroupItem(that.listGroupAllData[0])
          }
        })
      },
      refreshCurrentList() {
        this.closeGroupItem(this.currentGroupItem)
        this.openGroupItem(this.currentGroupItem)
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

  .gl-list-plus .ant-list-item-content {
    flex: none;
    margin-right: .5em;
  }

</style>
