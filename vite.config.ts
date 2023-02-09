import { defineConfig, PluginOption } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import htmlTemplate from 'vite-plugin-html-template';
import EnvironmentPlugin from 'vite-plugin-environment';
import eslintPlugin from 'vite-plugin-eslint';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

function resolve(dir) {
  return path.join(__dirname, dir);
}

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  // vite插件
  const vitePlugins: (PluginOption | PluginOption[])[] = [
    vue(),
    htmlTemplate(),
    EnvironmentPlugin('all', { prefix: 'VUE_APP_' }),
    Components({
      resolvers: [ElementPlusResolver()],
      types: [],
      dts: true,
    }),
  ];

  isDev &&
    vitePlugins.push(
      eslintPlugin({
        include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.vue', 'src/**/*.tsx', 'src/**/*.ts'],
        exclude: ['./node_modules/**'],
        cache: false,
      }),
    );

  return {
    resolve: {
      alias: {
        '@': resolve('src'),
        '/#/': resolve('types'),
      },
    },
    plugins: [...vitePlugins],
  };
});
