import { memo, useEffect } from "react";
import Monaco, { OnChange, useMonaco } from "@monaco-editor/react";
import { classNames } from "../utils/classNames";

export interface EditorProps {
  defaultValue?: string;
  path?: string;
  value?: string;
  onChange?: OnChange;

  language?: "javascript" | "html" | "css";
  defaultLanguage?: "javascript" | "html" | "css";

  className?: string;
  style?: React.CSSProperties;
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
  } = props;
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    monaco.editor.defineTheme("dracula", DraculaTheme);
  }, [monaco]);

  return (
    <div className={classNames(className)} style={style}>
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
      />
    </div>
  );
});

export interface FileModel {
  path: string;
  value: string;
  type: "javascript" | "html" | "css";
}

const DraculaTheme = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "comment", foreground: "6272a4", fontStyle: "italic" },
    { token: "keyword", foreground: "ff79c6" },
    { token: "string", foreground: "f1fa8c" },
    { token: "number", foreground: "bd93f9" },
    { token: "type", foreground: "8be9fd", fontStyle: "italic" },
  ],
  colors: {
    "editor.foreground": "#f8f8f2",
    "editor.background": "#282a36",
    "editor.lineHighlightBackground": "#44475a",
    "editorCursor.foreground": "#f8f8f2",
    "editorWhitespace.foreground": "#424450",
  },
};
