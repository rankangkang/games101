import { useControllableValue } from "ahooks";
import { memo, useState } from "react";
import { Editor } from "../Editor/Editor";
import { FileTree } from "../FileTree/FileTree";
import { classNames } from "../../utils/classNames";
import { useMonacoInit } from "../Editor/useMonacoInit";
import { FileModel } from "../../types";
import { mime2Lang } from "../../utils/ext";
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

  const [selectedModelPath, setSelectedModelPath] = useState<string>(
    models[0]?.path ?? ""
  );

  const monaco = useMonacoInit();

  const selectedModel = models?.find(
    (model) => model.path === selectedModelPath
  );

  const editor = selectedModel ? (
    <Editor
      className={classNames("items-stretch flex-1")}
      path={selectedModel.path}
      value={selectedModel.value}
      language={mime2Lang(selectedModel.type)}
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
  ) : null;

  if (!monaco) {
    return null;
  }

  return (
    <div className="flex">
      <div className="w-64 flex flex-col">
        {props.renderHeader?.()}
        <FileTree
          className="min-w-fit flex-1"
          models={models}
          selectedPath={selectedModelPath}
          onSelect={setSelectedModelPath}
        />
      </div>
      {editor}
    </div>
  );
});
