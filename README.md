# Games 101 Playground

最近在刷 games101，但苦于练习环境是 C++，所以想着搭建一套自己的运行环境。
做了一半发现不如实现一套在线运行环境算了，所以有了 [Games101 Playground](https://rankangkang.github.io/games101/).

项目基于 vite + react + monaco-editor 实现，使用 iframe 作为沙箱，辅以 service worker 拦截沙箱请求，实现了一套类似于浏览器的脚本加载机制。想法不是很成熟，所以目前限制还蛮多的：

- 使用 indexedDB 存储代码，便于主线程与 worker 线程使用
- 目前只支持 `js|html|css|md｜json` 编辑，且还不知文件新建（maybe 未来可以支持）
- 所有的 assignments 基于 ThreeJS 编写，通过 importmap 注入，可直接通过 `import { xxx } from 'three'` 引入

## 备忘录

1. 编辑器模块
   核心工具: Monaco Editor

微软官方开源的浏览器端代码编辑器（VS Code 底层）。

支持语法高亮、智能提示、代码折叠等高级功能。

集成方式:

javascript
import \* as monaco from 'monaco-editor';
const editor = monaco.editor.create(document.getElementById('editor'), {
value: 'console.log("Hello World")',
language: 'javascript'
});
增强功能:

多标签页: 自行管理编辑器实例和文件状态。

文件树: 使用 react-arborist 或自定义组件实现。

2. 虚拟文件系统
   核心工具: memfs + unionfs

memfs: 纯内存文件系统，模拟 Node.js 的 fs API。

unionfs: 合并多个文件系统（如内存 + 只读 CDN 依赖）。

代码示例:

javascript
import { fs } from 'memfs';
import { union } from 'unionfs';
union(fs).use(/_ 其他文件系统 _/);
fs.writeFileSync('/src/index.js', 'console.log("Hello")');
持久化: 可将文件状态保存到 IndexedDB 或后端服务。

3. 代码编译/打包
   核心工具: esbuild (WASM 版本)

速度快，支持 TS/JSX/CSS，适合浏览器环境。

集成示例:

javascript
import { build } from 'esbuild-wasm';

// 初始化 esbuild
await initialize({ wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm' });

// 打包代码
const result = await build({
entryPoints: ['/src/index.js'],
bundle: true,
write: false,
plugins: [/* 自定义插件 */],
});
依赖解析:

esm.sh: 将 npm 依赖转换为 ESM CDN 地址（如 import React from 'https://esm.sh/react'）。

Browserify CDN: 直接加载 CommonJS 模块。

4. 沙箱预览
   核心工具: 动态 iframe + 消息通信

安全隔离执行用户代码，避免污染主页面。

实现步骤:

动态创建隐藏的 iframe。

将打包后的代码注入 iframe。

通过 postMessage 实现控制台输出捕获、错误监控。

代码示例:

javascript
const iframe = document.createElement('iframe');
iframe.style.display = 'none';
document.body.appendChild(iframe);

// 注入代码
const html = `

  <html><body>
    <script>${packedCode}</script>
  </body></html>
`;
iframe.contentDocument.open();
iframe.contentDocument.write(html);
iframe.contentDocument.close();

// 捕获控制台输出
iframe.contentWindow.console.log = (...args) => {
parent.postMessage({ type: 'console', args }, '\*');
}; 5. 辅助技术栈
模块 推荐工具 用途
项目模板 vite/create-vite 模板或自定义模板 快速生成初始项目结构
依赖管理 esm.sh/skypack + browserify 按需加载 npm 依赖
热更新 (HMR) vite-plugin-wasm + 自定义 HMR 逻辑 实现代码修改后实时预览
状态管理 zustand/jotai 管理编辑器、文件系统、预览状态
UI 组件库 @mui/material 或 shadcn-ui 快速搭建界面
后端协作 Supabase/Firebase 或自研 Node.js 服务 用户认证、项目持久化 6. 完整架构流程图
用户操作 → Monaco Editor → 文件变更 → memfs
↓
esbuild 编译打包
↓
生成代码 → iframe 沙箱
↓
预览渲染 + 控制台输出捕获/错误监控 7. 关键挑战与解决方案
依赖加载

问题: 浏览器无法直接加载 node_modules。

方案: 通过 esm.sh 或 skypack 将依赖转换为 ESM CDN URL。

大型项目性能

问题: 内存文件系统和 WASM 打包可能卡顿。

方案: 限制文件数量，使用 Web Workers 分离打包线程。

安全性

问题: 用户代码可能包含恶意脚本。

方案: 严格限制 iframe 沙箱权限（如 sandbox="allow-scripts"），禁用网络请求。

调试支持

方案: 通过 sourcemap 映射错误到源码位置，捕获 window.onerror 事件。

8. 可运行的简化示例
   javascript
   // 主框架代码
   import { fs } from 'memfs';
   import { initialize, build } from 'esbuild-wasm';

// 初始化文件系统
fs.mkdirSync('/src');
fs.writeFileSync('/src/index.js', 'console.log("Hello World")');

// 初始化 esbuild
await initialize({ wasmURL: 'https://unpkg.com/esbuild-wasm/esbuild.wasm' });

// 打包代码
const result = await build({
entryPoints: ['/src/index.js'],
bundle: true,
write: false,
});

// 注入沙箱
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);
iframe.contentDocument.write(`

  <script>${result.outputFiles[0].text}</script>

`);
总结
核心工具链: Monaco Editor + memfs + esbuild-wasm + iframe 沙箱。

进阶扩展: 添加实时协作（CRDT）、TypeScript 语言服务、Git 集成。

## next

monaco-editor(可用 react arborist 做 tree) + esbuild-wasm（可运行在 worker，防止主线程卡顿）+ memfs（备份在indexedDB） + iframe
