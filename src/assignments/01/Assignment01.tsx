import { use } from 'react'
import { CodeSandbox } from '../../components/CodeSandbox/CodeSandbox'
import { ASSIGNMENTS_BASE_PREFIX } from '../../config'
import { syncFileModels } from '../../db'
import type { FileModel } from '../../types'
import { MimeType } from '../../types'
import { join } from '../../utils/path'
import { replaceVariables } from '../../utils/replace'
import html from './index.html?raw'
import mainJs from './main.js?raw'
import rasterizerJs from './Rasterizer.js?raw'
import readme from './README.md?raw'
import rendererJs from './Renderer.js?raw'
import triangleJs from './triangle.js?raw'

export function Assignment01() {
  const models = use(modelsPromise)
  return <CodeSandbox models={models} baseUrl={baseUrl} />
}

const baseUrl = join(ASSIGNMENTS_BASE_PREFIX, '01')

const entryHtml = replaceVariables(html, {
  main: join(baseUrl, 'main.js'),
})

const defaultModels: FileModel[] = [
  {
    type: MimeType.HTML,
    value: entryHtml,
    path: 'index.html',
    baseUrl,
  },
  {
    type: MimeType.JavaScript,
    value: mainJs,
    path: 'main.js',
    baseUrl,
  },
  {
    type: MimeType.JavaScript,
    value: rendererJs,
    path: 'Renderer.js',
    baseUrl,
  },
  {
    type: MimeType.JavaScript,
    value: rasterizerJs,
    path: 'Rasterizer.js',
    baseUrl,
  },
  {
    type: MimeType.JavaScript,
    value: triangleJs,
    path: 'Triangle.js',
    baseUrl,
  },
  {
    type: MimeType.Markdown,
    value: readme,
    path: 'README.md',
    baseUrl,
  },
]

const modelsPromise = syncFileModels(defaultModels)
