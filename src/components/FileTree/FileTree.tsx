import { memo, useCallback, useLayoutEffect, useMemo, useState } from "react";
import { classNames } from "../../utils/classNames";
import { FileModel } from "../../types";
import { getFileIcon } from "../utils";

interface FileTreeProps {
  rootPath?: string;
  models: FileModel[];
  selectedPath?: string;
  onSelect: (path: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const FileTree = memo(function FileTree({
  rootPath = "/",
  models,
  selectedPath,
  onSelect,
  className,
  style,
}: FileTreeProps) {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

  // 构建文件树结构
  const tree = useMemo(() => {
    const root: TreeNode = {
      name: rootPath,
      path: rootPath,
      type: "root",
      children: [],
    };

    models.forEach((model) => {
      const parts = model.path.split("/");
      let current = root;

      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const isLast = i === parts.length - 1;
        const path = parts.slice(0, i + 1).join("/");

        let child = current.children.find((c) => c.name === part);
        if (!child) {
          child = {
            name: part,
            path,
            type: isLast ? "file" : "directory",
            children: [],
          };
          current.children.push(child);
        }
        current = child;
      }
    });

    return root;
  }, [models, rootPath]);

  useLayoutEffect(() => {
    const expandedPaths = new Set<string>();
    function traverse(node: TreeNode) {
      if (node.type === "directory" || node.type === "root") {
        expandedPaths.add(node.path);
      }
      node.children.forEach(traverse);
    }

    // 初始，展开所有目录
    traverse(tree);
    setExpandedPaths(new Set(expandedPaths));
  }, []);

  const renderNode = useCallback(
    (node: TreeNode, level: number = 0) => {
      const isSelected = node.path === selectedPath;
      const hasChildren = node.children.length > 0;
      const isExpanded = expandedPaths.has(node.path);
      const indent = level * 16;

      node.children.sort(sortTreeNode);

      return (
        <div key={node.path}>
          <div
            onClick={() => {
              if (node.type === "directory" || node.type === "root") {
                toggleExpand(node.path);
              } else {
                onSelect(node.path);
              }
            }}
            style={{
              paddingLeft: `${indent + 8}px`,
              userSelect: "none",
            }}
            className={classNames(
              "hover:bg-[#35363E] hover:cursor-pointer",
              "flex items-center px-[8px] py-[4px]",
              isSelected && "!bg-[#35363E]",
              node.type === "root" && "!text-[#F6F6F4] !font-bold !bg-[#292A35]"
            )}
          >
            {hasChildren ? (
              <span
                style={{
                  marginRight: "4px",
                  fontSize: "12px",
                  transform: isExpanded ? "rotate(-90deg)" : "rotate(-180deg)",
                  transformOrigin: "center",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                く
              </span>
            ) : (
              <span style={{ marginRight: "4px", width: "12px" }} />
            )}
            <FileIcon type={node.type} name={node.name} />
            {node.name}
          </div>
          {hasChildren && isExpanded && (
            <div>
              {node.children.map((child) => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    },
    [selectedPath, onSelect, expandedPaths, toggleExpand]
  );

  return (
    <div
      className={classNames(
        "bg-[#262626] text-[#F6F6F4] text-[12px] overflow-auto",
        className
      )}
      style={{
        fontFamily: "Consolas, Monaco, monospace",
        ...style,
      }}
    >
      {renderNode(tree)}
    </div>
  );
});

interface TreeNode {
  name: string;
  path: string;
  type: "file" | "directory" | "root";
  children: TreeNode[];
}

// VSCode 风格的图标组件
const FileIcon = ({ type, name }: { type: TreeNode["type"]; name: string }) => {
  const getIcon = () => {
    if (type === "root") return "🗂️";
    if (type === "directory") return "📁";
    return getFileIcon(name);
  };

  return (
    <span style={{ marginRight: "4px", fontSize: "16px" }}>{getIcon()}</span>
  );
};

function sortTreeNode(a: TreeNode, b: TreeNode) {
  if (a.type === "directory" && b.type === "file") {
    return -1;
  }
  if (a.type === "file" && b.type === "directory") {
    return 1;
  }

  return String.prototype.localeCompare.call(a.name, b.name);
}
