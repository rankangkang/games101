// 组合 编辑器 和 游戏
import { useMemo, useRef, useState } from 'react'
import { Code } from './Code/Code'
import { idb } from '../../db'
import { join } from '../../utils/path'
import type { FileModel } from '../../types'
import { MimeType } from '../../types'
import Sandbox from './Sandbox/Sandbox'
import type { ImperativePanelHandle } from 'react-resizable-panels'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Sidebar } from './Code/Sidebar'
import { getSidebarConfig } from '../../router/sidebarConfig'
import { useMemoizedFn } from 'ahooks'

export interface CodeSandboxProps {
  baseUrl?: string
  models: FileModel[]
}

export function CodeSandbox(props: CodeSandboxProps) {
  const { models: initialModels, baseUrl = '' } = props

  // 存储中间态，点击运行时，将中间态存储到 idb，然后更新 sandbox
  const [models, setModels] = useState<FileModel[]>(initialModels)

  const [entry, setEntry] = useState<string | undefined>(
    models.find((model) => model?.type === MimeType.HTML)?.value,
  )

  const sandboxRef = useRef<{ forceUpdate: () => void }>({
    forceUpdate: () => {},
  })

  const previewPanelRef = useRef<ImperativePanelHandle>(null)
  const editorPanelRef = useRef<ImperativePanelHandle>(null)
  const [treePanelVisible, setTreePanelVisible] = useState(true)

  const handleRun = useMemoizedFn(async () => {
    // 更新 sandbox 内容
    const html = models.find((model) => model.type === MimeType.HTML)?.value
    setEntry(html)
    sandboxRef.current.forceUpdate()
  })

  const handleSave = useMemoizedFn(async (nextModels: FileModel[]) => {
    const promises = nextModels.map((model) => {
      const key = join(baseUrl, model.path)
      return idb.setFileModel(key, model)
    })
    await Promise.all(promises)
    setModels(nextModels)
  })

  const sidebarConfig = useMemo(() => {
    const config = getSidebarConfig()
    config.top.unshift(
      {
        id: 'project',
        title: 'Project',
        icon: '🗂️',
        onClick: () => {
          setTreePanelVisible((prev) => !prev)
        },
      },
      {
        id: 'run',
        title: 'Run',
        icon: '▶️',
        onClick: handleRun,
      },
      {
        id: 'save',
        title: 'Save',
        icon: '💾',
        onClick: () => handleSave(models),
      },
    )
    return config
  }, [models, handleRun, handleSave])

  return (
    <PanelGroup direction="horizontal" className="w-full h-full">
      <Panel
        ref={editorPanelRef}
        defaultSize={50}
        minSize={0}
        className="w-full h-full border border-[#343434] rounded-sm shadow-lg"
      >
        <Code
          rootPath={baseUrl}
          className="w-full h-full"
          models={models}
          onModelChange={handleSave}
          treeVisible={treePanelVisible}
          sidebar={() => {
            return <Sidebar config={sidebarConfig} />
          }}
        />
      </Panel>

      <PanelResizeHandle className="w-2 bg-[#262626] hover:bg-[#4a4a5e] cursor-col-resize flex items-center justify-center rounded-[4px]">
        <div className="w-[4px] h-10 bg-gray-500 rounded-full"></div>
      </PanelResizeHandle>

      <Panel
        ref={previewPanelRef}
        defaultSize={50}
        minSize={0}
        className="w-full h-full border border-[#343434] rounded-sm shadow-lg"
      >
        <Sandbox ref={sandboxRef} html={entry} />
      </Panel>
    </PanelGroup>
  )
}
