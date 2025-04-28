import type { FileModel } from '../../../types'
import { join } from '../../../utils/path'

export function generateImportMap(importMapScripts: FileModel[]) {
  const importList = importMapScripts.map((script) => ({
    name: join(script.baseUrl, script.path),
    url: URL.createObjectURL(new Blob([script.value], { type: 'text/javascript' })),
  }))

  const importMap = importList.reduce(
    (r, item) => {
      r.imports[item.name] = item.url
      return r
    },
    { imports: {} } as { imports: Record<string, string> },
  )

  return JSON.stringify(importMap)
}

export function generateFullHtml(
  config: {
    html?: string
    styles?: string | string[]
    scripts?: string | string[]
    title?: string
    importmap?: Record<string, unknown>
  } = {},
) {
  const { html, styles, scripts, title = 'Sandbox', importmap } = config

  const scriptList = Array.isArray(scripts) ? scripts : [scripts]
  const scriptContent = scriptList
    .map((script) => `<script type="module">${script}</script>`)
    .join('\n')

  const importmapContent = importmap
    ? `<script type="importmap">${JSON.stringify(importmap)}</script>`
    : ''

  const stylesList = Array.isArray(styles) ? styles : [styles]
  const stylesContent = stylesList.map((style) => `<style>${style}</style>`).join('\n')

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${stylesContent}
    ${importmapContent}
  </head>
  <body>
    ${html}
    ${scriptContent}
  </body>
</html>`
}
