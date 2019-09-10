<template>
  <div :style="style" style="display: block;" v-show="show" @mousedown.stop @contextmenu.prevent @click="close">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'GlContextMenu',
    data() {
      return {
        onShow: () => {
        },
        onHide: () => {
        },
        x: null,
        y: null,
        style: {},
        binded: false,
        show: this.visible
      }
    },
    props: {
      // target: HTMLElement
      target: {},
      visible: {
        type: Boolean,
        default() {
          return false
        }
      }
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
      bindEvents() {
        this.$nextTick(() => {
          if (!this.target || this.binded) return
          this.onShow = this.contextMenuHandler.bind(this)
          this.target.addEventListener('contextmenu', this.onShow)
          this.binded = true
        })
      },
      unbindEvents() {
        if (!this.target) return
        this.target.removeEventListener('contextmenu', this.onShow)
      },
      bindHideEvents() {
        this.onHide = this.clickDocumentHandler.bind(this)
        document.addEventListener('mousedown', this.onHide)
        document.addEventListener('mousewheel', this.onHide)
      },
      unbindHideEvents() {
        document.removeEventListener('mousedown', this.onHide)
        document.removeEventListener('mousewheel', this.onHide)
      },
      clickDocumentHandler(e) {
        this.$emit('update:show', false)
      },
      contextMenuHandler(e) {
        this.x = e.clientX
        this.y = e.clientY
        this.resize()
        this.$emit('update:show', true)
        e.preventDefault()
      },
      resize() {
        this.style = {
          left: `${this.x }px`,
          top: `${this.y }px`
        }
      },
      open() {
        this.show = true
      },
      close() {
        this.show = false
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
