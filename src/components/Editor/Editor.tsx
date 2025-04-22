import { memo } from "react";
import Monaco, { OnChange } from "@monaco-editor/react";
import { classNames } from "../../utils/classNames";

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
