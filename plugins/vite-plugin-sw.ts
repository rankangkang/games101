import { buildSync } from 'esbuild'
import type { PluginOption, ViteDevServer } from 'vite'

interface PluginSwOptions {
  registerPath: string
  entryPoint: string
  outfile: string
  minify?: boolean
  sourcemap?: boolean
}

export default function (options: PluginSwOptions): PluginOption {
  const { registerPath, entryPoint, outfile, minify = true, sourcemap = true } = options
  return {
    name: 'vite-plugin-sw',
    configureServer(server: ViteDevServer) {
      server.middlewares.use((req, res, next) => {
        if (req.url === registerPath) {
          const result = buildSync({
            bundle: true,
            entryPoints: [entryPoint],
            write: false,
            minify,
            sourcemap,
          })

          res.setHeader('Content-Type', 'application/javascript')
          res.setHeader('Service-Worker-Allowed', '/')
          res.end(result.outputFiles[0].text)
          return
        }

        next()
      })
    },
    transformIndexHtml() {
      // 构建时编译 Service Worker
      buildSync({
        bundle: true,
        entryPoints: [entryPoint],
        outfile,
        minify,
        sourcemap,
      })
    },
  }
}
