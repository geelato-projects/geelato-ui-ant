const path = require('path')
const webpack = require('webpack')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  // 生产环境是否生成 sourceMap 文件
  // productionSourceMap: false,
  // 修改 src 为 examples
  pages: {
    index: {
      entry: 'examples/main.js',
      template: 'public/index.html',
      filename: 'index.html'
    }
  },
  // 强制内联CSS
  // css: {extract: false},
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          /* less 变量覆盖，用于自定义 ant design 主题 */
          'primary-color': '#2185d0',
          'link-color': '#2185d0',
          'border-radius-base': '0px'
        },
        javascriptEnabled: true
      }
    }
  },
  /*
    configureWebpack是调整webpack配置最简单的一种方式，可以新增也可以覆盖cli中的配置。
    可以是一个对象：被 webpack-merge 合并到webpack 的设置中去
    也可以是一个函数：如果你需要基于环境有条件地配置行为，就可以进行一些逻辑处理，可以直接修改或
  新增配置，(该函数会在环境变量被设置之后懒执行)。该方法的第一个参数会收到已经解析好的配置。
    在函数内，你可以直接修改配置，或者返回一个将会被合并的对象。
  */
  configureWebpack: {
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      // 依赖大小分析工具
      // new BundleAnalyzerPlugin(),
    ],
    externals: {
      // key: main.js中全局引入的路径
      // value: 全局暴露出来的对象名
      // 'vue': 'Vue',
      'vue-router': 'VueRouter',
      'axios': 'axios',
      'ant-design-vue': 'Antd',
      'vee-validate': 'VeeValidate',
      'vue-i18n': 'VueI18n',
      'moment': 'moment'
    }
  },
  // chainWebpack 这个库提供了一个 webpack 原始配置的上层抽象，使其可以定义具名的 loader 规则
  // 和具名插件，可以通过其提供的一些方法链式调用，在cli-service中就使用了这个插件
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('packages'))
      // 解决antd icon打包过大的问题
      .set('@ant-design/icons/lib/dist$', path.resolve(__dirname, './packages/icons.js'))

    // packages和examples目录需要加入编译
    config.module
      .rule('js')
      .include.add(/packages/)
      .end()
      // .include.add(/examples/)
      // .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        // 修改它的选项...
        return options;
      });
  },
  devServer: {
    // contentBase: path.join(__dirname, 'dist'),
    // compress: true,
    port: 9000
  }
}

