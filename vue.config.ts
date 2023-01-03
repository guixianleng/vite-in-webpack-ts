const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const Components = require('unplugin-vue-components/webpack');

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
      Components({
        types: [],
        dts: true,
      }),
    ],
  },
});
