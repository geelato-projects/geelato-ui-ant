<!--

-->
<template>
  <div class="gl-table gl-table-as-list" v-if="opts">
    <div class="table-page-search-wrapper" v-show="opts.query.show||opts.query.show===undefined">
      <top-query ref="query" :controlRefs="controlRefs" :properties="opts.query.mix.properties"
                 :colPerRow="opts.query.mix.layout.fieldPerRow"
                 :gutter="opts.query.mix.layout.gutter||48"
                 @input="onQuery"></top-query>
    </div>

    <div class="table-operator" v-show="opts.toolbar.show||opts.toolbar.show===undefined">
      <template v-for="(action) in opts.toolbar.actions" v-if="action.gid=action.gid||$gl.utils.uuid(8)">
        <!--@click="onToolbarAction(action,{rowSelection:options.rowSelection,index:index})"-->
        <a-button :ref="action.gid" :type="action.type||'primary'" :icon="action.icon"
                  :key="action.gid" v-if="action.show===undefined||rungs(action.show)" style="margin-right:0.5em">
          {{action.title||action.text}}
        </a-button>&nbsp;
      </template>
      <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} 提示信息</a-button>
    </div>
    <!--由于下拉菜单在收起状态时，ref选不中，这里增加一个隐藏状态的按钮用于在设计时可选择配置-->
    <div class="table-columns-operator" v-show="false">
      <template v-for="action in opts.table.rowAction.actions" v-if="action.gid=action.gid||$gl.utils.uuid(8)">
        <a-button type="link" :key="action.gid" :ref="action.gid">{{action.title||action.text}}</a-button>
      </template>
    </div>
    <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns=columns
        :showHeader="opts.table.showHeader"
        :data="loadData"
        :alert="options.alert"
        :rowSelection="options.rowSelection"
        :pageSize=opts.table.pageSize
        :showPagination="opts.showPagination"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="action" slot-scope="text, record">
        <template
            v-if="opts.table.rowAction.actions.length <=(opts.table.rowAction.maxShow || 2)">
          <template v-for="(action,actionIndex) in opts.table.rowAction.actions">
            <a @click="onRowAction(action,record)" :key="action.gid">{{action.title||action.text}}</a>
            <a-divider type="vertical" :key="actionIndex" v-if="opts.table.rowAction.actions.length>1"/>
          </template>
        </template>
        <template v-else>
          <template>
            <a @click="onRowAction(opts.table.rowAction.actions[0],record)">{{opts.table.rowAction.actions[0].title||opts.table.rowAction.actions[0].text}}</a>
            <a-divider type="vertical"/>
          </template>
         <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-for="(action,actionIndex) in opts.table.rowAction.actions" v-if="actionIndex>0"
                           :key="action.gid">
                <a @click="onRowAction(action,record)">{{action.title||action.text}}</a>
              </a-menu-item>
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
  // import ActionHandler from '../../ActionHandler'

  let GEELATO_SCRIPT_PREFIX = 'gs:'
  // let REGEXP_FORM = /gs[\s]*:[\s]*\$ctx\.form\.[a-zA-Z]+[a-zA-Z0-9]*/g;
  // let REGEXP_CTX = /\$ctx/g
  // let REGEXP_DEPEND_PROPERTY = /\$ctx\.[a-zA-Z]+/g
  // let CONST_GQL_PARENT = '$parent'
  export default {
    name: 'GlTable',
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
        optionAlertShow: true,
        controlRefs: {}
      }
    },
    updated() {
      console.log('geelato-ui-ant > gl-table > updated() ')
      this.clearControlRef()
      this.generateControlRef()
    },
    computed: {
      columns() {
        for (let i in this.opts.table.columns) {
          let column = this.opts.table.columns[i]
          // 列自定义渲染辅助字段
          // column.customRenderString = (column.customRenderString === undefined ? '' : column.customRenderString)
          if (column.customRenderString) {
            try {
              column.customRender = eval(column.customRenderString)
            } catch (e) {
              console.error('geelato-ui-ant > gl-table > The format of column.customRenderString is incorrect:', column.customRenderString + '.', e)
            }
          }
        }
        return this.opts.table.columns
      }
    },
    created() {
      this.tableOption()
    },
    mounted() {
      this.refresh()
      this.generateControlRef()
    },
    destroyed() {
      this.clearControlRef()
    },
    methods: {
      // query组件的查询回调，获取查询条件信息，并调用loadData查询数据，并以数据驱动刷新页面
      onQuery(data) {
        console.log('geelato-ui-ant > gl-table > Index.vue > onQuery > data: ', data)
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
      refresh() {
        this.onQuery(this.$refs.query.getCondition())
      },
      deleteSelectedRowsByEntity({entityName}) {
        if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
          return this.$gl.api.delete(entityName, {'id|in': this.selectedRowKeys.join(',')})
        } else {
          this.$message.warn('未选择需删除的项。')
          return false
        }
      },
      deleteOneByEntity({entityName, data}) {
        if (data && data.id) {
          return this.$gl.api.delete(entityName, {'id': data.id})
        } else {
          this.$message.warn('指定删除的记录无效。')
          console.error('geelato-ui-ant > gl-table > Index.vue > deleteOneByEntity() > data:', data)
          return false
        }
      },
      $_onDeleted(params, data) {
        this.refresh()
      },
      // 加载数据方法 必须为 Promise 对象
      loadData(parameter) {
        console.log('geelato-ui-ant > gl-table > Index.vue > loadData > parameter: ', parameter)
        const thisVue = this
        thisVue.parameter = parameter

        // 构建列表查询gql
        function genGql(queryData) {
          const root = {}
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
          root['@order'] = parameter.field ? parameter.field + '|' + (parameter.sortOrder === 'descend' ? 'desc' : 'asc') : thisVue.opts.table.order
          root['@p'] = parameter.pageNo + ',' + parameter.pageSize
          const gql = {}
          gql[thisVue.opts.entity] = root
          console.log('geelato-ui-ant > gl-table > Index.vue > loadData > genGql(): ', gql)
          return gql
        }

        function isVirtualColumn(field) {
          return field === '' || field === '空' || field === '无' || field === undefined
        }

        return this.$gl.api.queryByGql(genGql(this.lastMixQueryData)).then(res => {
          console.log('geelato-ui-ant > gl-table > Index.vue > loadData > res:', res)
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
      // onToolbarAction(action, rowSelection) {
      //   let controlComponent = this.$_getRefByGid(action.gid)
      //   console.log('geelato-ui-ant > gl-table > Index.vue > onToolbarAction() > action:', action)
      //   console.log('geelato-ui-ant > gl-table > Index.vue > onToolbarAction() > rowSelection:', rowSelection)
      //   console.log('geelato-ui-ant > gl-table > Index.vue > onToolbarAction() > control:', controlComponent)
      // },
      onRowAction(action, record) {
        let controlComponent = this.$_getRefByGid(action.gid)
        console.log('geelato-ui-ant > gl-table > Index.vue > onRowAction() > action:', action)
        console.log('geelato-ui-ant > gl-table > Index.vue > onRowAction() > record:', record)
        console.log('geelato-ui-ant > gl-table > Index.vue > onRowAction() > control:', controlComponent)
        // this.$_doAction(action, record)
        controlComponent.$emit('click', this, record)
      },
      // onToolbarAction(action) {
      //   console.log('geelato-ui-ant > gl-table > Index.vue > onToolbarAction() > action:', action)
      //   this.$gl.ui.openModal(this, action.modal)
      // },
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
      generateControlRef() {
        for (let i in this.$refs) {
          this.controlRefs[i] = this.$refs[i][0]
        }
        console.log('geelato-ui-ant > gl-table > generateControlRef() > $refs,controlRefs: ', this.$refs, this.controlRefs)
      },
      clearControlRef() {
        for (let i in this.$refs) {
          delete this.controlRefs[i]
        }
        console.log('geelato-ui-ant > gl-table > clearControlRef() > $refs,controlRefs: ', this.$refs, this.controlRefs)
      },
      $_getRefByGid(gid) {
        return this.controlRefs[gid]
      }
    }
  }
</script>
<style>
  .gl-table table {
    display: table;
    table-layout: fixed
  }

  .gl-table td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .gl-table th {
    overflow: hidden;
  }
</style>
