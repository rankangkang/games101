// 组合 编辑器 和 游戏
import { useRef, useState } from "react";
import { Code } from "../Code/Code";
import { generateImportMap } from "../Sandbox/utils";
import { idb } from "../../db";
import { getStoragePath } from "../../utils/path";
import { FileModel, MimeType } from "../../types";
import Sandbox from "../Sandbox/Sandbox";
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
  ImperativePanelHandle,
} from "react-resizable-panels";

export interface PlaygroundProps {
  models: FileModel[];
}

export function Playground(props: PlaygroundProps) {
  const { models: initialModels } = props;

  // 存储中间态，点击运行时，将中间态存储到 idb，然后更新 sandbox
  const [models, setModels] = useState<FileModel[]>(initialModels);

  const [entry, setEntry] = useState<string | undefined>(
    models.find((model) => model?.type === MimeType.HTML)?.value
  );

  const sandboxRef = useRef<{ forceUpdate: () => void }>({
    forceUpdate: () => {},
  });

  const previewPanelRef = useRef<ImperativePanelHandle>(null);
  const editorPanelRef = useRef<ImperativePanelHandle>(null);

  const importMap = generateImportMap([]);

  const handleRun = async () => {
    // 更新 sandbox 内容
    const html = models.find((model) => model.type === MimeType.HTML)?.value;
    setEntry(html);
    sandboxRef.current.forceUpdate();
  };

  const handleSave = async (nextModels: FileModel[]) => {
    const promises = nextModels.map((model) => {
      const key = getStoragePath(model.path);
      return idb.setFileModel(key, model);
    });
    await Promise.all(promises);
    setModels(nextModels);
  };

  return (
    <div className="flex flex-col w-full h-[800px]">
      <PanelGroup
        direction="horizontal"
        className="w-full h-[calc(100vh-120px)]"
      >
        <Panel ref={editorPanelRef} defaultSize={50} minSize={20}>
          <Code
            className="w-full h-full"
            models={models}
            onModelChange={handleSave}
            renderHeader={() => {
              return (
                <ToolBar onSave={() => handleSave(models)} onRun={handleRun} />
              );
            }}
          />
        </Panel>

        <PanelResizeHandle className="w-2 bg-[#333440] hover:bg-[#4a4a5e] cursor-col-resize flex items-center justify-center">
          <div className="w-[4px] h-10 bg-gray-500 rounded-full"></div>
        </PanelResizeHandle>

        <Panel ref={previewPanelRef} defaultSize={50} minSize={20}>
          <Sandbox
            ref={sandboxRef}
            className="w-full h-full"
            html={entry}
            importMap={importMap}
          />
        </Panel>
      </PanelGroup>
    </div>
  );
}

const ToolBar = (props: { onSave: () => void; onRun: () => void }) => {
  const { onSave, onRun } = props;
  return (
    <div className="flex justify-center gap-6 bg-[#262626] text-[14px]">
      <div
        className="p-[2px] cursor-pointer hover:bg-[#333440] rounded-[4px] w-[32px] h-[32px] flex items-center justify-center"
        onClick={onSave}
      >
        💾
      </div>
      <div
        className="p-[2px] cursor-pointer hover:bg-[#333440] rounded-[4px] w-[32px] h-[32px] flex items-center justify-center"
        onClick={onRun}
      >
        ▶️
      </div>
    </div>
  );
};
