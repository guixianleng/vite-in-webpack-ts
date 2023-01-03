import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import htmlTemplate from 'vite-plugin-html-template';
import EnvironmentPlugin from 'vite-plugin-environment';
import eslintPlugin from 'vite-plugin-eslint';
import Components from 'unplugin-vue-components/vite';

function resolve(dir) {
  return path.join(__dirname, dir);
}

export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        '@': resolve('src'),
        '/#/': resolve('types'),
      },
    },
    plugins: [
      vue(),
      htmlTemplate(),
      EnvironmentPlugin('all', { prefix: 'VUE_APP_' }),
      Components({
        types: [],
        dts: true,
      }),
      mode === 'development' &&
        eslintPlugin({
          include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.vue', 'src/**/*.tsx', 'src/**/*.ts'],
          exclude: ['./node_modules/**'],
          cache: false,
        }),
    ],
  };
});
