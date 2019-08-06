module.exports = {
  dest: 'dist/docs',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'Geelato UI',
      description: '企业级后台管理页面UI框架'
    }
    // 打开以下的注释，将会在首页的右方出来多语言的切换开关
    // ,
    // '/en/': {
    //     lang: 'en-US',
    //     title: 'Geelato',
    //     description: 'A admin platform base on Vue + SemanticUI + SpringBoot'
    // }
  },
  // 注入到当前页面的 HTML <head> 中的标签
  head: [
    // ['link', {rel: 'icon', href: '/favicon.ico'}], // 增加一个自定义的 favicon(网页标签的图标)
    ['link', {rel: 'icon', href: `/logo.png`}],
    ['link', {rel: 'manifest', href: '/manifest.json'}],
    ['meta', {name: 'theme-color', content: '#3eaf7c'}],
    ['meta', {name: 'apple-mobile-web-app-capable', content: 'yes'}],
    ['meta', {name: 'apple-mobile-web-app-status-bar-style', content: 'black'}],
    // ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    // ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#af0525' }],
    // ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', {name: 'msapplication-TileColor', content: '#000000'}]
  ],
  docsDir: 'docs',
  // base: '/', // 这是部署到github相关的配置
  markdown: {
    // 代码块显示行号
    lineNumbers: true
  },
  themeConfig: {
    // 显示所有页面的标题链接  默认值：false,
    displayAllHeaders: false,
    // 默认值：true，默认情况下，当用户通过滚动查看页面的不同部分时，嵌套的标题链接和 URL 中的 Hash 值会实时更新
    activeHeaderLinks: true,
    // 设置成 0 将会禁用标题（headers）链接，同时，最大的深度为 2，它将同时提取 h2 和 h3 标题，显示在侧边栏上。
    sidebarDepth: 1,
    // 文档更新时间：每个文件git最后提交的时间
    lastUpdated: '上次更新',
    // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
    repo: 'geelato-projects/geelato-ui-ant',
    // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
    // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
    // repoLabel: '查看源码',
    // 以下为可选的编辑链接选项

    // 假如你的文档仓库和项目本身不在一个仓库：
    // docsRepo: 'vuejs/vuepress',
    // 假如文档不是放在仓库的根目录下：
    docsDir: 'docs',
    // 假如文档放在一个特定的分支下：
    // docsBranch: 'master',
    // 默认是 false, 设置为 true 来启用
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！',
    locales: {
      '/en/': {
        nav: [
          {text: 'Index', link: '/'},
          {text: 'Guide', link: '/guide/'},
          {text: 'Config Reference', link: '/config/'},
          // {text: 'Github', link: 'https://github.com/geelato-projects'},
        ],
        sidebar: {
          '/guide/': genSidebarConfig('Guide')
        }
      },
      '/': {
        nav: [
          {text: '首页', link: '/'},
          {text: '组件', link: '/guide/'},
          {text: '配置', link: '/config/'},
          // {text: '演示', link: '/showcase/'},
          // {text: 'Github', link: 'https://github.com/geelato-projects'},
        ],
        sidebar: {
          '/guide/': genSidebarConfig('指南')
        }
      }
    },
  },
  plugins: [
    '@vuepress/i18n-ui',
    '@vuepress/last-updated',
    '@vuepress/back-to-top',
    '@vuepress/pwa',
    '@vuepress/back-to-top',
  ],
  // plugins: {
  //   '@vuepress/i18n-ui': true,
  //   '@vuepress/back-to-top': true,
  //   '@vuepress/last-updated': true,
  //   '@vuepress/pwa': {
  //     serviceWorker: true,
  //     updatePopup: true
  //   },
  //   '@vuepress/plugin-medium-zoom': true,
  // },
  less: {
    modifyVars: {
      /* less 变量覆盖，用于自定义 ant design 主题 */
      'primary-color': '#2185d0',
      'link-color': '#2185d0',
      'border-radius-base': '0px'
    },
    javascriptEnabled: true
  }
  // configureWebpack: (config, isServer) => {
  //   if (!isServer) {
  //     // 修改客户端的 webpack 配置
  //     return {
  //       proxyTable: {
  //         '/api': {
  //           target: 'http://api.geelato.org:8080',  //目标接口域名
  //           changeOrigin: true,  //是否跨域
  //           pathRewrite: {
  //             '^/api': ''   //重写接口
  //           }
  //         }
  //       }
  //     }
  //   }
  // }
}

function genSidebarConfig(title) {
  return [
    {
      title,
      collapsable: false,
      children: [
        '',
        'getting-started',
        'ui-gl-form',
        'ui-gl-table',
        'ui-gl-list',
        'ui-gl-tree',
        'ui-gl-card',
        'ui-gl-card-layout',
        'ui-gl-modal',
        'mix',
      ]
    }
  ]
}
