# Games 101 Playground

最近在刷 games101，但苦于练习环境是 C++，所以想着搭建一套自己的运行环境。
做了一半发现不如实现一套在线运行环境算了，所以有了 [Games101 Playground](https://rankangkang.github.io/games101/).

项目基于 vite + react + monaco-editor 实现，使用 iframe 作为沙箱，辅以 service worker 拦截沙箱请求，实现了一套类似于浏览器的脚本加载机制。想法不是很成熟，所以目前限制还蛮多的：

- 使用 indexedDB 存储代码，便于主线程与 worker 线程使用
- 目前只支持 `js|html|css|md｜json` 编辑，且还不知文件新建（maybe 未来可以支持）
- 所有的 assignments 基于 ThreeJS 编写，通过 importmap 注入，可直接通过 `import { xxx } from 'three'` 引入
