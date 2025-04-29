import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'path'
import { defineConfig } from 'vite'
import sw from './plugins/vite-plugin-sw'
import { ROUTE_BASE_NAME, SERVICE_WORKER_PATH } from './src/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  // 设置 base 路径
  base: ROUTE_BASE_NAME,
  plugins: [
    { enforce: 'pre', ...mdx({}) },
    react(),
    tailwindcss(),
    sw({
      registerPath: SERVICE_WORKER_PATH,
      entryPoint: resolve(__dirname, './src/sw.ts'),
      outfile: resolve(__dirname, 'dist', 'sw.js'),
    }),
  ],
})
