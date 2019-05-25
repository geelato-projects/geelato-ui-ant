<template>
  <div class="gl-table">
    <div class="table-page-search-wrapper">
      <top-query :fields="opts.query.mix.fields" :colPerRow="opts.query.mix.fieldPerRow" :gutter="48"
                 @input="onQuery"></top-query>
    </div>

    <div class="table-operator">
      <template v-for="(action,index) in opts.toolbar.actions">
        <a-button :type="action.color||'primary'" :icon="action.icon" @click="onToolbarAction(action,index)"
                  :key="index" v-if="action.show===undefined||rungs(action.show)">{{action.title}}
        </a-button>&nbsp;
      </template>
      <!--<a-button type="primary" icon="plus" @click="handleEdit()">新建</a-button>-->
      <!--<a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">-->
      <!--<a-menu slot="overlay">-->
      <!--<a-menu-item key="1">-->
      <!--<a-icon type="delete"/>-->
      <!--删除-->
      <!--</a-menu-item>-->
      <!--&lt;!&ndash; lock | unlock &ndash;&gt;-->
      <!--<a-menu-item key="2">-->
      <!--<a-icon type="lock"/>-->
      <!--锁定-->
      <!--</a-menu-item>-->
      <!--</a-menu>-->
      <!--<a-button style="margin-left: 8px">-->
      <!--批量操作-->
      <!--<a-icon type="down"/>-->
      <!--</a-button>-->
      <!--</a-dropdown>-->
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} 提示信息</a-button>
    </div>

    <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns=opts.table.columns
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
        :pageSize=opts.table.pageSize
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="opts.table.rowAction.actions.length <=2">
          <template v-for="(action,actionIndex) in opts.table.rowAction.actions">
            <a @click="onRowAction(action,record)" :key="actionIndex">{{action.title}}</a>
            <a-divider type="vertical" :key="actionIndex"/>
          </template>
        </template>
        <template v-else>
          <template>
            <a @click="onRowAction(opts.table.rowAction.actions[0],record)">{{opts.table.rowAction.actions[0].title}}</a>
            <a-divider type="vertical"/>
          </template>
         <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-for="(action,actionIndex) in opts.table.rowAction.actions" v-if="actionIndex>0"
                           :key="actionIndex">
                <a @click="onRowAction(action,record)">{{action.title}}</a>
              </a-menu-item>
              <!--<a-menu-item v-if="$auth('table.disable')">-->
              <!--<a href="javascript:;">禁用</a>-->
              <!--</a-menu-item>-->
              <!--<a-menu-item v-if="$auth('table.delete')">-->
              <!--<a href="javascript:;">删除</a>-->
              <!--</a-menu-item>-->
            </a-menu>
          </a-dropdown>
        </template>
      </span>
    </s-table>
  </div>
</template>

<script>
  import mixin from '../../mixin'
  import moment from 'moment'
  import TopQuery from './TopQuery'
  import utils from '../../utils'

  // import * as utilPlus from '@/utils/utilPlus'
  // import { getRoleList } from '@/api/manage'

  let GEELATO_SCRIPT_PREFIX = 'gs:'
  // let REGEXP_FORM = /gs[\s]*:[\s]*\$ctx\.form\.[a-zA-Z]+[a-zA-Z0-9]*/g;
  // let REGEXP_CTX = /\$ctx/g
  // let REGEXP_DEPEND_PROPERTY = /\$ctx\.[a-zA-Z]+/g
  // let CONST_GQL_PARENT = '$parent'

  export default {
    name: 'gl-table',
    components: {
      TopQuery
    },
    mixins: [mixin],
    props: {
      opener: {
        type: Object,
        required: false
      },
      modal: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        mdl: {},
        // 查询参数
        queryParam: {},
        selectedRowKeys: [],
        selectedRows: [],
        parameter: {},
        // custom table alert & rowSelection
        options: {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange
          }
        },
        optionAlertShow: false
      }
    },
    computed: {},
    created() {
      this.tableOption()
      // getRoleList({ t: new Date() })
    },
    methods: {
      // query组件的查询回调，获取查询条件信息，并调用loadData查询数据，并以数据驱动刷新页面
      onQuery(data) {
        console.log('gl-table > onQuery > data : ', data)
        this.lastMixQueryData = data.value
        // 有e，则是来源于查询操作按钮，需重置后再查询
        if (data.e) {
          this.needResetPagination = true
        }
        if (this.needResetPagination) {
          // this.resetPagination()
        }
        this.$refs.table.refresh(true)
        // this.loadData(this.parameter)
        this.selectedRowKeys = []
        this.selectedRows = []
      },
      // 加载数据方法 必须为 Promise 对象
      loadData(parameter) {
        console.log('gl-table > loadData > parameter : ', parameter)
        const thisVue = this
        thisVue.parameter = parameter

        // 构建列表查询gql
        function genGql(queryData) {
          const root = {}
          // if (queryData) {
          //   for (const i in queryData) {
          //     root[i] = queryData[i]
          //   }
          // }
          Object.assign(root, queryData)
          const fsAry = []
          for (const i in thisVue.opts.table.columns) {
            const col = thisVue.opts.table.columns[i]
            // 过滤掉空列，或计算列
            if (!isVirtualColumn(col.dataIndex)) {
              fsAry.push(col.dataIndex)
            }
          }
          root['@fs'] = fsAry.join(',')
          root['@order'] = thisVue.opts.table.order
          root['@p'] = parameter.pageNo + ',' + parameter.pageSize
          const gql = {}
          gql[thisVue.opts.entity] = root
          console.log('gl-table > loadData  > genGql: ', gql)
          return gql
        }

        function isVirtualColumn(field) {
          return field === '' || field === '空' || field === '无' || field === undefined
        }

        return this.api.queryByGql(genGql(this.lastMixQueryData)).then(res => {
          return res
        })
      },
      tableOption() {
        if (!this.optionAlertShow) {
          this.options = {
            alert: {
              show: true,
              clear: () => {
                this.selectedRowKeys = []
              }
            },
            rowSelection: {
              selectedRowKeys: this.selectedRowKeys,
              onChange: this.onSelectChange
            }
          }
          this.optionAlertShow = true
        } else {
          this.options = {
            alert: false,
            rowSelection: null
          }
          this.optionAlertShow = false
        }
      },

      handleEdit(record) {
        this.$emit('onEdit', record)
      },
      handleOk() {

      },
      onRowAction(action, record) {
        console.log('gl-table > onRowAction > action:  ', action)
        console.log('gl-table > onRowAction > record:  ', record)
      },
      onToolbarAction(action) {
        console.log('gl-table > onToolbarAction > ', action)
        this.$pageManager.openModal(this, action.modal)
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },

      resetSearchForm() {
        this.queryParam = {
          date: moment(new Date())
        }
      },
      /**
       * gs(geelato script)执行表达式，若非gs表达式则直接返回
       * @param str e.g. "gs:$ctx.table.selectedRowKeys.length > 0"
       */
      rungs(str) {
        let $ctx = this
        if (typeof str === 'string' && str.indexOf(GEELATO_SCRIPT_PREFIX) === 0) {
          return utils.eval(str.substring(3), $ctx)
        } else {
          return str
        }
      },
    }
  }
</script>
<style>
  .gl-table table {
    display: table;
    table-layout: fixed
  }
</style>
