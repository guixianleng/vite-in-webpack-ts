# Vite in webpack

由于项目功能比较多，现有的vite插件不具备兼容所有的vue3项目，故将Vite 作为webpack（vue-cli）开发环境运行构建， 为稳定生产环境上项目运行，依然使用webpack进行打包构建。
这里使用 `pnpm` 进行 `vue-cli` 项目的搭建，请先全局安装 `pnpm`

# 基础项目搭建 Vite + Webpack + Ts

这里我们选择用`Vue-cli`来创建基础 Vue3 项目然后添加 Vite 的支持，不选择`Vite`来创建基础项目的原因是加 Vite 比加 Webpack 要容易一些，前人已经留下了许多经验。

这里为了 Webpack 的支持，主要用到的vite插件有 `Vite` `@vitejs/plugin-vue` `vite-plugin-html-template` `vite-plugin-environment`。

## Vue-cli 创建 Vue3 项目

## ⚡️ 增加 Vite 支持，使用 Vite 开发

Vite 的爽点这里就不说了，嘿嘿嘿嘿 ⚡️⚡️⚡️。

要添加 Vite 的支持我们首先需要安装`Vite`与`@vitejs/plugin-vue`：

```
pnpm add -D vite @vitejs/plugin-vue
```

我们在根目录下创建 `vite.config.js`，写入基础的配置：

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [vue()],
});
```

这里我们添加了基础的 alias 以及 Vite 需要的配置，当然现在配置还不够，无法顺利跑起来。

配置 alias 的话对应的 `tsconfig.json` 中也需要添加 path:

```json
{
  "paths": {
    "@/*": ["src/*"],
  }
}
```

更多关于`@vitejs/plugin-vue`的配置信息：https://www.npmjs.com/package/@vitejs/plugin-vue

## 🛠️ vite-plugin-html-template

由于我们需要同时支持 Webpack 和 Vite，在处理我们最终输出的 html 的时候(SPA 应用总会有一个出口 html)我们需要让 Vite 与 Webpack 保持一致，做代码上的兼容，这个插件帮我们完成了这件事情。

`yarn add vite-plugin-html-template`

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import htmlTemplate from "vite-plugin-html-template";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [vue(), htmlTemplate()],
});
```

单页面应用的话不需要额外配置，如果你想搞一个多页面应用，可以看一下它的配置信息：

https://www.npmjs.com/package/vite-plugin-html-template

## 🔩 vite-plugin-environment

在某一次 Vite 的迭代中环境变量`process`变成了`import.meta`但 Webpack 上还是用的`process`，与 html 一样我们需要做一个兼容，让 Webpack 和 Vite 都可以运行，这个插件可以帮我们做这件事情：

`yarn add vite-plugin-environment`

```ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import htmlTemplate from "vite-plugin-html-template";
import EnvironmentPlugin from "vite-plugin-environment";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
      store: "/src/store",
    },
  },
  plugins: [
    vue(),
    htmlTemplate(),
    EnvironmentPlugin("all", { prefix: "VUE_APP_" }),
  ],
});
```

创建环境变量的写法与之前一致，all 与 prefix 搭配使用，可以加载全部是这个前缀的环境变量。

```
WARNING

如果没有写任何环境变量文件的话插件还是不会生成process变量，至少需要存在一个.env文件和一个环境变量。
```

如果不想增加额外的插件也有直接写的方式：

```ts
import { defineConfig } from "vite";
// ...
export default defineConfig({
  // ...
  define: {
    "process.env": {
      VUE_APP_API_URL: "https://www.baidu.com",
    },
  },
});
```

更多关于环境变量的讨论可以看这个 Issue:

https://github.com/vitejs/vite/issues/1973

添加完这个插件我们就可以跑起 Hello World 啦：

可以直接`yarn vite`，当然比较正经的做法是在`package.json`里添加：

```json
{
  "scripts": {
    "dev": "vite --mode dev"
  }
}
```

# 📦 其他有用的基础配置

## babel 的一些有用的配置

`可选链操作符(?.)`和`空值合并运算符(??)`在写业务时非常香，由于开发时我们用的 `Vite` + `Ts`，而默认的 `Ts` 编译为 `esnext` 天生就支持了这两个运算符，不会编译到更低版本（当然如果你遇到的棘手的兼容性 BUG 就需要编译至更低版本了，祝你好运）。

这里我们可以给 `babel` 添加这些配置来让 `Webpack` 的打包生效：

`yarn add @babel/plugin-proposal-optional-chaining`

`yarn add @babel/plugin-proposal-nullish-coalescing-operator`

在`babel.config.js`中：

```json
{
  "plugins": [
    "@babel/plugin-proposal-optional-chaining",
    "@babel/plugin-proposal-nullish-coalescing-operator"
  ]
}
```

## 可能想忽略的 ts 错误

在 git hooks 一节里我们并没有配置提交时的 `Ts` 的检查，`Ts` 的检查没法像 `eslint` 检查一样只对做出修改的文件生效，如果每次提交前都做 `Ts` 的全量检查会花很多时间，所以我们把 `Ts` 的检查放在了打包处(这里 Vue-cli 开箱即用，不需要配置)。

`Ts` 全量检查可以为我们发现很多业务中 breaking change 的类型错误(API 类型更改，组件 props 更改等等)，但有时也会有一些没有来得及更新的第三方库的 type 本身无法通过检查(说的就是你七牛桑)，这里我们可以通过配置`fork-ts-checker`来跳过一些目录/文件的 `Ts` 检查，这是一个仅 Webpack 的配置：

vue.config.js:

```js

  chainWebpack: config => {
    config.plugins.get("fork-ts-checker").tap(options => {
      options[0].issue = {};
      options[0].issue.exclude = [{ file: "node_modules/*" }];
      return options;
    });
  },
```

## Install and use

- Get the project code

```bash
git clone https://github.com/guixianleng/vite-in-webpack-ts.git
```

- Installation dependencies

```bash
cd vite-in-webpack-ts

pnpm install

```

- run

```bash
pnpm serve or pnpm dev
```

- build

```bash
pnpm build
```
