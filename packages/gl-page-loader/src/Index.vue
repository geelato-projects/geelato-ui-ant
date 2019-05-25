<!--
  通用的加载页面，实现动态路由，通过currentView切换页面，并通过opts、query传递属性及查询参数给渲染的页面
  注意：加载的页面，需存放于本page.vue所在目录下
-->
<template>
  <div>
    <component v-if="!message.header" :is="currentView"
               :opts="pageCfg.opts&&pageCfg.opts.ui?pageCfg.opts.ui:pageCfg.opts"
               :query="queryString">
      <!-- 组件在 vm.currentview 变化时改变！ -->
    </component>
    <a-alert v-if="message.header"
             :message="message.header"
             :description="message.text"
             type="info"
             showIcon
    />
  </div>
</template>
<script>
  import mixin from '../../mixin'

  export default {
    name: 'gl-page-loader',
    mixins: [mixin],
    props: {
      // 模式一 opts:{code:xx,query:xx}，一般用于在modalView打开本vue时，使用
      opts: {
        type: Object
      },
      // 模式二 无opts，直接code:xx,query:xx
      code: {
        type: String
      },
      query: {
        type: Object
      }
    },
    data() {
      return {
        pageCode: '',
        queryString: '',
        currentView: '',
        pageCfg: '',
        message: {}
      }
    },
    mounted: function () {
      // 组件创建完后获取数据，
      // 此时 data 已经被 observed 了
      this.getPageConfig()
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      '$route': 'getPageConfig'
    },
    methods: {
      getPageConfig() {
        let thisVue = this
        this.message = {}
        thisVue.pageCode = thisVue.opts && thisVue.opts.code ? thisVue.opts.code : thisVue.code
        thisVue.queryString = thisVue.opts && thisVue.opts.query ? thisVue.opts.query : thisVue.query
        console.log('gl-page-loader > Index > pageCode:  ', thisVue.pageCode)
        if (!thisVue.pageCode) {
          thisVue.$set(thisVue.message, 'header', '加载失败')
          thisVue.$set(thisVue.message, 'text', 'PageCode为空，无法加载页面配置。')
          return
        }
        // 注意！！！
        // 先切换到加载页面，若无该切换，操作this.currentView会保留在真正需打开的页面上
        // 若该路由变化且this.currentView require的vue是同一个时，会导致页面不刷新，
        // 就算路由的参数如id等变化也不刷新
        thisVue.currentView = resolve => require(['./PageLoading.vue'], resolve)
        // 路由的格式：page/:moduleName/:pageCode?query
        thisVue.api.getPageCfg(thisVue.pageCode).then((res) => {
          console.log('gl-page-loader > Index > getPageConfig > res: ', res)
          if (res.code === '0') {
            console.log('gl-page-loader > Index > pageCfg.component: ', thisVue.pageCfg.component)
            if (res.data && res.data.length > 0) {
              thisVue.pageCfg = JSON.parse(res.data[0].content)
              if (typeof thisVue.pageCfg.component === 'string') {
                if (thisVue.pageCfg.component.startsWith('/')) {
                  console.log('gl-page-loader > Index > loading component: ', '../../' + thisVue.pageCfg.component.substring(1) + '.vue')
                  // 注意require的写法，这里写成'../'而不是'..'，后者会异常；同时url不能为多于一加号“+”拼接而成，这与require的加载机制有关
                  // componentsPath: 'components/gl-table/Index.vue'
                  let componentsPath = thisVue.pageCfg.component.substring(1) + '.vue'
                  thisVue.currentView = resolve => require(['../../' + componentsPath], resolve)
                } else {
                  console.error('gl-page-loader > Index > 不支持的component格式: ', thisVue.pageCfg.component, '当前页面配置为：', thisVue.pageCfg)
                }
              } else {
                console.error('gl-page-loader > Index > 不支持的component格式: ', thisVue.pageCfg.component, '当前页面配置为：', thisVue.pageCfg)
              }
            } else {
              thisVue.$set(thisVue.message, 'header', '加载失败')
              thisVue.$set(thisVue.message, 'text', '通过pageCode：“' + thisVue.pageCode + '”获取不到页面配置，请确保是否已配置、注册了该页面。')
            }
          } else {
            console.error('gl-page-loader > Index > 返回状态码code不为0。当前返回结果：', res)
          }
        })
      }
    }
  }
</script>
<!-- 添加 'scoped' 属性，使该CSS只应用于本vue。 -->
<style>
</style>
