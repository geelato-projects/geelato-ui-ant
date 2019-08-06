<template>
  <div class="gl-tree">
    <a-tree ref="glTree"
            :treeData="gData"
            :checkable="checkable"
            :showIcon="showIcon"
            :draggable="draggable"
            :showLine="showLine"
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
                     :target="contextMenuTarget"
                     @update:show="(show) => contextMenuVisible = show">
      <a-menu mode="vertical" v-if="contextMenuVisible">
        <template v-for="(menuItem,index) in menuItems">
          <a-menu-item v-if="!menuItem.children" @click="onContextMenuItemClick(menuItem,index)" :key="index"
                       class="gl-context-menu-item">
            <a-icon :type="menuItem.icon"/>
            {{menuItem.label}}
          </a-menu-item>
          <a-sub-menu v-else :key="index">
            <span slot="title" class="gl-context-menu-item"><a-icon
                :type="menuItem.icon"/><span>{{menuItem.label}}</span></span>
            <!-- TODO onContextMenuItemClick不生效？-->
            <a-menu-item v-for="(subMenuItem,subIndex) in menuItem.children"
                         @click="onContextMenuItemClick(subMenuItem,subIndex)" :key="subIndex"
                         class="gl-context-menu-item">
              <a-icon :type="subMenuItem.icon"/>
              {{subMenuItem.label}}
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </gl-context-menu>

    <!--<gl-context-menu ref="contextMenu">-->

    <!--</gl-context-menu>-->
  </div>
</template>

<script>

  export default {
    name: 'gl-tree',
    components: {},
    props: {
      draggable: {
        type: Boolean,
        default() {
          return true
        }
      },
      dropDisableTo: {
        type: Array,
        default() {
          return ['file']
        }
      },
      showLine: {
        type: Boolean,
        default() {
          return false
        }
      },
      checkable: {
        type: Boolean,
        default() {
          return false
        }
      },
      showIcon: {
        type: Boolean,
        default() {
          return true
        }
      },
      treeData: [Array],
      loadData: Function,
      /**
       * 整棵树对应业务实体名称
       */
      treeEntityName: {
        type: String,
        required: true
      },
      /**
       * 整棵树对应业务实体主健字段名，默认为id
       */
      treeEntityPkField: {
        type: String,
        required: false,
        default() {
          return 'id'
        }
      },
      /**
       * 整棵树对应业务实体名称字段名，默认为name
       */
      treeEntityNameField: {
        type: String,
        required: true,
        default() {
          return 'name'
        }
      },
      /**
       * 树对应业务实体某条记录的id，例如，对于项目文件树，该treeId的值为项目id，这样就可以通过项目id获取整个项目文件树。
       */
      treeId: {
        type: [Number, String],
        required: true
      },
      treeName: {
        type: [Number, String],
        required: true
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
      /**
       * 节点对应业务实体名称
       */
      nodeEntityName: {
        type: String,
        required: true
      },
      /**
       * 节点对应业务实体主健字段名，默认为id
       */
      nodeEntityPkField: {
        type: String,
        required: false,
        default() {
          return 'id'
        }
      },
      /**
       * 节点对应业务实体名称字段名，默认为name
       */
      nodeEntityNameField: {
        type: String,
        required: true,
        default() {
          return 'name'
        }
      },
      menuItems: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        contextMenuVisible: false,
        contextMenuTarget: null,
        gData: this.treeData
      }
    },
    mounted(){

    },
    methods: {
      onSelect(selectedKeys, info) {
        console.log('gl-tree > selected: ', selectedKeys, info)
      },
      onCheck(checkedKeys, info) {
        console.log('gl-tree > onCheck: ', checkedKeys, info)
      },
      onDragEnter(info) {
        console.log('gl-tree > onDragEnter: ', info)
        // expandedKeys 需要受控时设置
        // this.expandedKeys = info.expandedKeys
      },
      onDrop(info) {
        let that = this
        console.log('gl-tree > onDrop: ', info)
        if (!droppable(info.node.dataRef)) {
          console.log('gl-tree > onDrop forbidden, xtype: ', info.node.dataRef.xtype)
          return
        }
        const dropKey = info.node.eventKey
        const dragKey = info.dragNode.eventKey
        console.log('gl-tree > onDrop > node: ', info.node, info.node.isLeaf2())
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
        const data = [...this.gData]

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
        this.gData = data
      },
      onRightClick(info) {
        console.log('gl-tree > onRightClick: ', info)
        this.contextMenuTarget = this.$refs.glTree.$el
        this.$refs.contextMenu.open()
      },
      onContextMenuItemClick(e) {
        console.log('gl-tree > onContextMenuItemClick > e: ', e)
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
