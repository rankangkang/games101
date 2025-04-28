/**
 * 1. 生成 assignments 目录，存在则跳过
 * 2. 生成 目标目录，存在则跳过
 * 3. 生成示例 README.md
 * 4. 生成示例 index.html
 * 5. 生成示例 main.js
 */

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'

// node scripts/generate-assignment.mjs 01
const assignmentName = process.argv[2]
if (!assignmentName) {
  throw new Error('🚨 Assignment name is required')
}

const assignmentsDir = join(process.cwd(), 'src', 'assignments')
const assignmentDir = join(assignmentsDir, assignmentName)

if (existsSync(assignmentDir)) {
  console.log(`⏳ ${assignmentDir} already exists`)
} else {
  mkdirSync(assignmentDir, { recursive: true })
  console.log(`✅ ${assignmentDir} created`)
}

function writeFile(fileName, content) {
  const filePath = join(assignmentDir, fileName)
  writeFileSync(filePath, content)
  console.log(`✅ ${filePath} created`)
}

// eslint-disable-next-line no-extend-native
String.prototype.toFirstUpper = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

const readme = /* markdown */ `# Assignment ${assignmentName}
`

const html = /* html */ `<!DOCTYPE html>
<html>

<head>
  <title>Assignment ${assignmentName.toFirstUpper()}</title>
  <script type="importmap">
    {
      "imports": {
        "three": "https://esm.sh/three@0.175.0",
        "three/": "https://esm.sh/three@0.175.0/"
      }
    }
  </script>
</head>

<body>
  <div id="root"></div>
  <style>
    body {
      margin: 0;
      padding: 0;
    }
    </style>
    <script type="module" src="{{ main }}"></script>
</body>

</html>
`

const js = /* js */ `import {} from 'three';

function main() {
  console.log('Hello, world!')
}

main()
`

const tsx = /* tsx */ `import { CodeSandbox } from "../../components/CodeSandbox/CodeSandbox";
import html from "./index.html?raw";
import js from "./main.js?raw";
import readme from "./README.md?raw";
import { FileModel, MimeType } from "../../types";
import { syncFileModels } from "../../db";
import { join } from "../../utils/path";
import { ASSIGNMENTS_BASE_PREFIX } from "../../config";
import { use } from "react";

export function Assignment${assignmentName.toFirstUpper()}() {
  const models = use(modelsPromise);
  return <CodeSandbox models={models} baseUrl={baseUrl} />;
}

const baseUrl = join(ASSIGNMENTS_BASE_PREFIX, "${assignmentName}");

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
    value: js,
    path: 'main.js',
    baseUrl,
  },
  {
    type: MimeType.Markdown,
    value: readme,
    path: 'README.md',
    baseUrl,
  },
]

const modelsPromise = syncFileModels(defaultModels);

`

writeFile('README.md', readme)
writeFile('index.html', html)
writeFile('main.js', js)
writeFile(`Assignment${assignmentName.toFirstUpper()}.tsx`, tsx)

console.log(`🎉 Assignment ${assignmentName} created!!!`)
