<template>
  <div :style="style" style="display: block;" v-show="show" @mousedown.stop @contextmenu.prevent>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'gl-context-menu',
    data() {
      return {
        onShow: () => {
        },
        onHide: () => {
        },
        x: null,
        y: null,
        style: {},
        binded: false
      }
    },
    props: {
      target: null,
      show: Boolean
    },
    mounted() {
      this.bindEvents()
    },
    watch: {
      show(val, oval) {
        if (val) {
          this.bindHideEvents()
        } else {
          this.unbindHideEvents()
        }
      },
      target(val, oval) {
        this.bindEvents()
      }
    },
    methods: {
      // 初始化事件
      bindEvents() {
        this.$nextTick(() => {
          if (!this.target || this.binded) return
          this.onShow = this.contextMenuHandler.bind(this)
          this.target.addEventListener('contextmenu', this.onShow)
          this.binded = true
        })
      },
      // 取消绑定事件
      unbindEvents() {
        if (!this.target) return
        this.target.removeEventListener('contextmenu', this.onShow)
      },
      // 绑定隐藏菜单事件
      bindHideEvents() {
        this.onHide = this.clickDocumentHandler.bind(this)
        document.addEventListener('mousedown', this.onHide)
        document.addEventListener('mousewheel', this.onHide)
      },
      // 取消绑定隐藏菜单事件
      unbindHideEvents() {
        document.removeEventListener('mousedown', this.onHide)
        document.removeEventListener('mousewheel', this.onHide)
      },
      // 鼠标按压事件处理器
      clickDocumentHandler(e) {
        this.$emit('update:show', false)
      },
      // 右键事件事件处理
      contextMenuHandler(e) {
        this.x = e.clientX
        this.y = e.clientY
        this.resize()
        this.$emit('update:show', true)
        e.preventDefault()
      },
      resize() {
        this.style = {
          left: this.x + 'px',
          top: this.y + 'px'
        }
      },
      open(e) {

      }
    }
  }
</script>

<style>
  .gl-context-menu {
    position: fixed;
    background: #fff;
    border: solid 1px rgba(0, 0, 0, .2);
    border-radius: 3px;
    z-index: 999;
    display: none;
  }

  .gl-context-menu a {
    width: 75px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    display: block;
    color: #1a1a1a;
  }

  .gl-context-menu a:hover {
    background: #eee;
    color: #fff;
  }

  .gl-context-menu {
    border: 1px solid #eee;
    box-shadow: 0 0.5em 1em 0 rgba(0, 0, 0, .1);
    border-radius: 1px;
  }

  .gl-context-menu a {
    padding: 2px;
  }

  .gl-context-menu a:hover {
    background: #d4d4d4;
  }
</style>
