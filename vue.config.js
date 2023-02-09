const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const Components = require('unplugin-vue-components/webpack');
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: process.env.NODE_ENV === 'development',
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        '/#/': resolve('types'),
      },
    },
    plugins: [
      // importStyle可以配置element-plus的样式引入方式，它默认是css，利用scss变量修改主题时，需要将这个属性设置为scss
      Components({
        resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
        types: [],
        dts: true,
      }),
    ],
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@use "@/styles/element/index.scss" as *;',
      },
    },
  },
});
