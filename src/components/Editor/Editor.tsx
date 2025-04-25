import { memo, useRef, useCallback } from "react";
import Monaco, { OnChange, OnMount } from "@monaco-editor/react";
import { classNames } from "../../utils/classNames";
import { SupportedLanguage } from "../../types";

export interface EditorProps {
  defaultValue?: string;
  path?: string;
  value?: string;
  onChange?: OnChange;

  language?: SupportedLanguage;
  defaultLanguage?: SupportedLanguage;

  readOnly?: boolean;

  className?: string;
  style?: React.CSSProperties;
  
  // 添加预览 Markdown 的回调
  onPreviewMarkdown?: () => void;
}

export const Editor = memo(function Editor(props: EditorProps) {
  const {
    value,
    defaultValue = value,
    onChange,
    className,
    style,
    path,
    language = "javascript",
    defaultLanguage = language,
    readOnly = false,
    onPreviewMarkdown,
  } = props;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);
  
  // 编辑器挂载后的回调
  const handleEditorDidMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    
    // 如果是 Markdown 文件且提供了预览回调，添加右键菜单
    if (language === SupportedLanguage.Markdown && onPreviewMarkdown) {
      // 添加右键菜单项
      editor.addAction({
        id: 'preview-markdown',
        label: 'Preview Markdown',
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: () => {
          onPreviewMarkdown();
        }
      });
    }
  }, [language, onPreviewMarkdown]);

  return (
    <div 
      className={classNames(className)} 
      style={style}
    >
      <Monaco
        path={path}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        height="100%"
        width="100%"
        theme="dracula"
        language={language}
        defaultLanguage={defaultLanguage}
        options={{
          readOnly,
        }}
        onMount={handleEditorDidMount}
      />
    </div>
  );
});
