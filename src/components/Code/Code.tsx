import { useControllableValue } from "ahooks";
import { memo, useState, useCallback } from "react";
import { Editor } from "../Editor/Editor";
import { FileTree } from "../FileTree/FileTree";
import { classNames } from "../../utils/classNames";
import { useMonacoInit } from "../Editor/useMonacoInit";
import { FileModel, MimeType } from "../../types";
import { mime2Lang } from "../../utils/ext";
import { TabList } from "../TabList/TabList";
import { Condition } from "../Condition/Condition";
import { MDXRenderer } from "../MDXRender/MDXRender";
export interface CodeProps {
  rootPath?: string;
  models?: FileModel[];
  onModelChange?: (models: FileModel[]) => void;
  sidebar?: (() => React.ReactNode) | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  treeVisible?: boolean;
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

  const selectedModel = openedModels?.find(
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

  // Markdown 预览功能
  const handlePreviewMarkdown = useCallback(() => {
    if (!selectedModel || selectedModel.type !== MimeType.Markdown) return;

    // 创建一个预览模型，使用相同的值，但添加 .preview 后缀
    const previewPath = `${selectedModel.path}.preview`;

    // 检查是否已经存在预览 tab
    const existingPreview = openedModels.find(
      (model) => model.path === previewPath
    );
    if (existingPreview) {
      // 如果已经存在，直接选择它
      setSelectedModelPath(previewPath);
      return;
    }

    // 创建预览模型
    const previewModel: FileModel = {
      path: previewPath,
      value: selectedModel.value,
      type: MimeType.Markdown,
      baseUrl: selectedModel.baseUrl,
    };

    // 添加到打开的标签页中
    setOpenedModels((prev) => [...prev, previewModel]);

    // 选中新预览标签页
    setSelectedModelPath(previewPath);
  }, [selectedModel, openedModels]);

  if (!monaco) {
    return null;
  }

  return (
    <div className={classNames("flex", props.className)} style={props.style}>
      <Condition if={props.sidebar}>{props.sidebar}</Condition>
      <Condition if={props.treeVisible}>
        <div className="w-64 flex flex-col">
          <FileTree
            rootPath={props.rootPath}
            className="min-w-fit flex-1"
            models={models}
            selectedPath={selectedModelPath}
            onSelect={handleSelectModel}
          />
        </div>
      </Condition>

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

            // 检查是否是预览模式
            const isPreview = path.endsWith(".preview");

            // 如果是 Markdown 预览模式，渲染预览视图
            if (type === MimeType.Markdown && isPreview) {
              return <MDXRenderer mdxString={value} />;
            }

            // 否则渲染编辑器
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
                onPreviewMarkdown={
                  type === MimeType.Markdown ? handlePreviewMarkdown : undefined
                }
              />
            );
          }}
        </Condition>
      </div>
    </div>
  );
});
