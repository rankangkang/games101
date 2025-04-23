// 组合 编辑器 和 游戏
import { useRef, useState } from "react";
import { Code } from "../Code/Code";
import { generateImportMap } from "../Sandbox/utils";
import { idb } from "../../db";
import { getStoragePath } from "../../utils/path";
import { FileModel, MimeType } from "../../types";
import Sandbox from "../Sandbox/Sandbox";

export interface PlaygroundProps {
  models: FileModel[];
}

export function Playground(props: PlaygroundProps) {
  const { models: initialModels } = props;

  // 存储中间态，点击运行时，将中间态存储到 idb，然后更新 sandbox
  const [models, setModels] = useState<FileModel[]>(initialModels);

  const [entry, setEntry] = useState<string | undefined>(
    models.find((model) => model.type === MimeType.HTML)?.value
  );

  const sandboxRef = useRef<{ forceUpdate: () => void }>({
    forceUpdate: () => {},
  });

  const importMap = generateImportMap([]);

  const handleRun = async () => {
    // 更新 sandbox 内容
    const html = models.find((model) => model.type === MimeType.HTML)?.value;
    setEntry(html);
    sandboxRef.current.forceUpdate();
  };

  const handleSave = async (nextModels: FileModel[]) => {
    console.log("handleSave");
    // models 变化时，更新 idb
    const promises = nextModels.map((model) => {
      const key = getStoragePath(model.path);
      return idb.setFileModel(key, model);
    });
    await Promise.all(promises);
    setModels(nextModels);
  };

  return (
    <div>
      <Sandbox
        ref={sandboxRef}
        className="w-full h-[300px]"
        html={entry}
        importMap={importMap}
      />
      <Code
        models={models}
        onModelChange={handleSave}
        renderHeader={() => {
          return (
            <div className="flex justify-center gap-6 bg-[#262626]">
              <div
                className="p-[4px] cursor-pointer hover:bg-[#333440] rounded-[4px] w-[36px] h-[36px] flex items-center justify-center"
                onClick={() => handleSave(models)}
              >
                💾
              </div>
              <div
                className="p-[4px] cursor-pointer hover:bg-[#333440] rounded-[4px] w-[36px] h-[36px] flex items-center justify-center"
                onClick={handleRun}
              >
                ▶️
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
