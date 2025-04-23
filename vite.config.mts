import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";
import { buildSync } from "esbuild";
import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';

// Service Worker 插件
const swPlugin = {
  name: "sw",
  configureServer(server: ViteDevServer) {
    // 开发服务器中间件
    server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (req.url === '/sw.js') {
        // 编译 Service Worker
        const result = buildSync({
          minify: false,
          bundle: true,
          sourcemap: true,
          entryPoints: [resolve(__dirname, "src/sw.ts")],
          write: false,
        });
        
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Service-Worker-Allowed', '/');
        res.end(result.outputFiles[0].text);
        return;
      }
      next();
    });
  },
  transformIndexHtml() {
    // 构建时编译 Service Worker
    buildSync({
      minify: true,
      bundle: true,
      sourcemap: true,
      entryPoints: [resolve(__dirname, "src/sw.ts")],
      outfile: resolve(__dirname, "dist/sw.js"),
    });
  }
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    { enforce: "pre", ...mdx({}) },
    react(),
    tailwindcss(),
    swPlugin
  ]
});
