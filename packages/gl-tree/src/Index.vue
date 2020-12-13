<template>
  <div class="gl-tree" v-if="opts">
    <a-tree ref="glTree"
            :treeData="treeData"
            :loadData="onLoadData"
            :checkable="opts.checkable"
            :showIcon="opts.showIcon"
            :draggable="opts.draggable"
            :showLine="opts.showLine"
            @dragenter="onDragEnter"
            @drop="onDrop"
            @select="onSelect"
            @rightClick="onRightClick"
            :defaultSelectedKeys="['0-0']"
    >
      <a-icon slot="smile" type="folder"/>
      <a-icon slot="meh" type="file"/>
      <template slot="custom" slot-scope="{selected}">
        <a-icon :type="selected ? 'frown':'frown-o'"/>
      </template>
    </a-tree>
    <gl-context-menu ref="contextMenu" class="gl-context-menu"
                     :target="contextMenuTarget" @update:show="(show) => contextMenuVisible = show">
      <a-menu mode="vertical" v-show="contextMenuVisible">
        <template v-for="(action,index) in opts.menuAction.actions">
          <a-menu-item :ref="action.gid" v-show="!action.children" @click="onContextMenuItemClick(action,index)"
                       :key="action.gid"
                       class="gl-context-menu-item">
            <a-icon :type="action.icon"/>
            {{action.title}}
          </a-menu-item>
          <a-sub-menu v-show="action.children" :key="action.gid+'_'+index">
            <span slot="title" class="gl-context-menu-item"><a-icon
                :type="action.icon"/><span>{{action.title}}</span></span>
            <!-- TODO onContextMenuItemClick不生效？-->
            <a-menu-item v-for="(subMenuItem,subIndex) in action.children"
                         @click="onContextMenuItemClick(subMenuItem,subIndex)" :key="subMenuItem.gid"
                         class="gl-context-menu-item">
              <a-icon :type="subMenuItem.icon"/>
              {{subMenuItem.title}}
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </gl-context-menu>
    <!--这里增加一个隐藏状态的按钮用于代理节点的事件-->
    <div class="tree-node-operator" v-show="false">
      <template v-for="action in opts.nodeAction.actions">
        <a-button type="link" :key="action.gid" :ref="action.gid">{{action.title||action.text}}</a-button>
      </template>
    </div>
  </div>
</template>

<script>
  import mixin from '../../mixin'
  import EntityDataReaderHandler from "../../EntityDataReaderHandler";

  export default {
    name: 'GlTree',
    mixins: [mixin],
    components: {},
    props: {
      dropDisableTo: {
        type: Array,
        default() {
          return ['file']
        }
      },
      /**
       *
       */
      fileTypes: {
        type: [Object],
        required: false,
        default() {
          return {
            file: {
              icon: "file icon",
              name: "文件",
              type: "file",
            }
          }
        }
      },
    },
    data() {
      return {
        currentSelectNode: {},
        currentRightClickNode: {},
        currentAction: {},
        contextMenuVisible: false,
        contextMenuTarget: null,
        treeData: [],
        treeConfig: this.opts,
        childrenDsNameDict: {}
      }
    },
    mounted() {
      this.loadFirstLevel()
      this.$_generateRefControl()
    },
    methods: {
      parseDsNameDict(tree) {
        let that = this
        tree.forEach(treeNodeDs => {
          if (treeNodeDs.gid && treeNodeDs.children) {
            this.childrenDsNameDict[treeNodeDs.gid] = treeNodeDs.children
            this.parseDsNameDict(treeNodeDs.children)
          } else {
            this.childrenDsNameDict[treeNodeDs.gid] = {}
          }
        })
      },
      /**
       *  初始加载第一层节点
       */
      loadFirstLevel() {
        let that = this
        this.parseDsNameDict(this.treeConfig.tree)
        let tree = JSON.parse(JSON.stringify(this.treeConfig.tree))
        // 未加载数据
        this.entityDataReaderHandler = new EntityDataReaderHandler({
          $gl: this.$gl,
          ds: this.treeConfig.ds
        })
        tree.forEach(treeNodeData => {
          // 解析数据源，并初始化加载数据
          this.entityDataReaderHandler.loadData({
            property: treeNodeData,
            callback: function (property, data) {
              data.forEach(item => {
                that.treeData.push({
                  title: item.title,
                  key: item.key,
                  isLeaf: treeNodeData.isLeaf,
                  glMeta: {
                    dsName: treeNodeData.dsName,
                    gid: treeNodeData.gid
                  }
                })
              })
              console.log('loadFirstLevel() > that.treeData:', that.treeData, property, data)
            }
          })
        })
      },
      onLoadData(treeNode) {
        let that = this
        console.log('geelato-ui-ant > gl-tree > onLoadData > treeNode:', treeNode)
        return new Promise(resolve => {
          // 存在子节点，已加载数据
          if (treeNode.dataRef.children) {
            resolve();
            return;
          }
          // 未加载数据
          this.entityDataReaderHandler = new EntityDataReaderHandler({
            $gl: this.$gl,
            ds: this.treeConfig.ds
          })
          console.log('geelato-ui-ant > gl-tree > onLoadData > childrenDsNameDict:', this.childrenDsNameDict, 'dsName:', treeNode.$vnode.data.props.glMeta.dsName)
          let children = this.childrenDsNameDict[treeNode.$vnode.data.props.glMeta.gid]
          children.forEach(item => {
              console.log('children', item)
              let dsName = item.dsName
              if (dsName) {
                // 解析数据源，并初始化加载数据
                this.entityDataReaderHandler.loadData({
                  property: {dsName: dsName},
                  ctx: treeNode,
                  callback: function (property, data) {
                    treeNode.dataRef.children = treeNode.dataRef.children || []
                    data.forEach(dataItem => {
                      treeNode.dataRef.children.push({
                        title: dataItem.title,
                        key: dataItem.key,
                        isLeaf: item.isLeaf,
                        // icon: '【项目】',
                        glMeta: {
                          gid: item.gid,
                          dsName: item.dsName
                        }
                      })
                    })
                    that.treeData = [...that.treeData]
                    console.log('onLoadData() > treeNode.dataRef.children:', treeNode, data)
                    resolve()
                  }
                })
              } else if (item.data) {
                treeNode.dataRef.children = treeNode.dataRef.children || []
                item.data.forEach(dataItem => {
                  treeNode.dataRef.children.push({
                    title: dataItem.title,
                    key: dataItem.key,
                    isLeaf: item.isLeaf,
                    glMeta: {
                      gid: item.gid,
                      dsName: undefined
                    }
                  })
                })
                that.treeData = [...that.treeData]
                resolve()
              } else {
                resolve()
              }
            }
          )
        });
      },
      onSelect(selectedKeys, info) {
        let action = this.opts.nodeAction.actions[0]
        this.currentAction = action
        if (selectedKeys.length === 1) {
          this.currentSelectNode = this.getCurrentNode(info)
        }
        let controlComponent = this.$_getRefControlByGid(action.gid)
        console.log('geelato-ui-ant > gl-tree > Index.vue > onSelect() > info:', info)
        console.log('geelato-ui-ant > gl-tree > Index.vue > onSelect() > action:', action)
        console.log('geelato-ui-ant > gl-tree > Index.vue > onSelect() > selectedKeys:', selectedKeys)
        console.log('geelato-ui-ant > gl-tree > Index.vue > onSelect() > currentSelectNode:', this.currentSelectNode)
        console.log('geelato-ui-ant > gl-tree > Index.vue > onSelect() > control:', controlComponent)
        controlComponent.$emit('click', this, this.currentSelectNode)
      },
      getCurrentNode(info) {
        let node = info.node.$vnode.data.props
        return {
          key: node.dataRef.key,
          title: node.title,
          isLeaf: node.isLeaf,
          icon: node.icon,
          glMeta: node.glMeta,
          _event: info
        }
      },
      onCheck(checkedKeys, info) {
        console.log('geelato-ui-ant > gl-tree > onCheck: ', checkedKeys, info)
      },
      onDragEnter(info) {
        console.log('geelato-ui-ant > gl-tree > onDragEnter: ', info)
        // expandedKeys 需要受控时设置
        // this.expandedKeys = info.expandedKeys
      },
      onDrop(info) {
        let that = this
        console.log('geelato-ui-ant > gl-tree > onDrop: ', info)
        if (!droppable(info.node.dataRef)) {
          console.log('geelato-ui-ant > gl-tree > onDrop forbidden, xtype: ', info.node.dataRef.xtype)
          return
        }
        const dropKey = info.node.eventKey
        const dragKey = info.dragNode.eventKey
        console.log('geelato-ui-ant > gl-tree > onDrop > node: ', info.node, info.node.isLeaf2())
        const dropPos = info.node.pos.split('-')
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
        const loop = (data, key, callback) => {
          data.forEach((item, index, arr) => {
            if (item.key === key) {
              return callback(item, index, arr)
            }
            if (item.children) {
              return loop(item.children, key, callback)
            }
          })
        }
        const data = [...this.treeData]

        function droppable(dataRef) {
          if (!that.dropDisableTo)
            return true
          for (let i in that.dropDisableTo) {
            if (that.dropDisableTo[i] === dataRef.xtype) {
              return false
            }
          }
          return true
        }

        // Find dragObject
        let dragObj
        loop(data, dragKey, (item, index, arr) => {
          arr.splice(index, 1)
          dragObj = item
        })
        if (!info.dropToGap) {
          // Drop on the content
          loop(data, dropKey, (item) => {
            item.children = item.children || [];
            // where to insert 示例添加到尾部，可以是随意位置
            item.children.push(dragObj);
          });
        } else if (
          (info.node.children || []).length > 0 // Has children
          && info.node.expanded // Is expanded
          && dropPosition === 1 // On the bottom gap
        ) {
          loop(data, dropKey, (item) => {
            item.children = item.children || [];
            // where to insert 示例添加到尾部，可以是随意位置
            item.children.unshift(dragObj);
          });
        } else {
          let ar;
          let i;
          loop(data, dropKey, (item, index, arr) => {
            ar = arr;
            i = index;
          });
          if (dropPosition === -1) {
            ar.splice(i, 0, dragObj);
          } else {
            ar.splice(i + 1, 0, dragObj);
          }
        }
        this.treeData = data
      },
      onRightClick(info) {
        console.log('geelato-ui-ant > gl-tree > onRightClick: ', info)
        this.currentRightClickNode = this.getCurrentNode(info)
        this.contextMenuTarget = this.$refs.glTree.$el
        this.$refs.contextMenu.open()
      },
      onContextMenuItemClick(action, index) {
        this.currentAction = action
        // console.log('geelato-ui-ant > gl-tree > onContextMenuItemClick > action,index: ', action, index)
        // let controlComponent = this.$_getRefControlByGid(action.gid)
        // console.log('geelato-ui-ant > gl-tree > Index.vue > onSelect() > action:', action)
        // console.log('geelato-ui-ant > gl-tree > Index.vue > onSelect() > currentRightClickNode:', this.currentRightClickNode)
        // console.log('geelato-ui-ant > gl-tree > Index.vue > onSelect() > control:', controlComponent)
        // controlComponent.$emit('click', this, {action: action, currentRightClickNode: this.currentRightClickNode})
      },
      ctxLoader() {
        return this
      }
    },
  }
</script>

<style scoped>

  .gl-context-menu .ant-menu-submenu-title, .gl-context-menu .ant-menu-submenu-item, .gl-context-menu-item {
    font-size: 12px !important;;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: 2em !important;
    padding-right: 2em !important;
    line-height: 28px !important;
    height: 28px !important;
  }
</style>
