import { useControllableValue } from "ahooks";
import { memo, useState } from "react";
import { Editor } from "../Editor/Editor";
import { FileTree } from "../FileTree/FileTree";
import { classNames } from "../../utils/classNames";
import { useMonacoInit } from "../Editor/useMonacoInit";
import { FileModel } from "../../types";
import { mime2Lang } from "../../utils/ext";
import { TabList } from "../TabList/TabList";
import { Condition } from "../Condition/Condition";

export interface CodeProps {
  rootPath?: string;
  models?: FileModel[];
  onModelChange?: (models: FileModel[]) => void;
  renderHeader?: () => React.ReactNode;
}

export const Code = memo(function Code(props: CodeProps) {
  const [models, setModels] = useControllableValue<FileModel[]>(props, {
    valuePropName: "models",
    trigger: "onModelChange",
    defaultValue: [],
  });

  const [selectedModelPath, setSelectedModelPath] = useState<string>("");

  const [openedModels, setOpenedModels] = useState<FileModel[]>([]);

  const monaco = useMonacoInit();

  const selectedModel = models?.find(
    (model) => model.path === selectedModelPath
  );

  const handleSelectModel = (path: string) => {
    setSelectedModelPath(path);

    setOpenedModels((opened) => {
      const index = opened.findIndex((model) => model.path === path);
      if (index >= 0) {
        return opened;
      }
      return [...opened, models.find((model) => model.path === path)].filter(
        Boolean
      ) as FileModel[];
    });
  };

  const handleCloseTab = (path: string) => {
    // 如果关闭当前打开的文件，选择下一个文件
    if (path === selectedModelPath) {
      const index = openedModels.findIndex((model) => model.path === path);
      // 如果有下一个文件，选择下一个，否则选择上一个
      const nextIndex = index < openedModels.length - 1 ? index + 1 : index - 1;
      if (nextIndex >= 0) {
        setSelectedModelPath(openedModels[nextIndex].path);
      } else {
        setSelectedModelPath("");
      }
    }

    // 从模型列表中移除该文件
    setOpenedModels((opened) => opened.filter((model) => model.path !== path));
  };

  if (!monaco) {
    return null;
  }

  return (
    <div className="flex justify-stretch">
      <div className="w-64 flex flex-col">
        {props.renderHeader?.()}
        <FileTree
          className="min-w-fit flex-1"
          models={models}
          selectedPath={selectedModelPath}
          onSelect={handleSelectModel}
        />
      </div>
      <div className="flex flex-col flex-1 justify-stretch bg-[#292A35]">
        <TabList
          models={openedModels}
          selectedPath={selectedModelPath}
          onSelect={handleSelectModel}
          onClose={handleCloseTab}
        />
        <Condition if={selectedModel}>
          {() => {
            const { path, value, type } = selectedModel!;
            return (
              <Editor
                className={classNames("items-stretch flex-1")}
                path={path}
                value={value}
                language={mime2Lang(type)}
                onChange={(val) => {
                  setModels((models) => {
                    return models.map((model) => {
                      if (model.path === selectedModelPath) {
                        return { ...model, value: val ?? "" };
                      }
                      return model;
                    });
                  });
                }}
              />
            );
          }}
        </Condition>
      </div>
    </div>
  );
});
