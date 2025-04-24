import { memo } from "react";
import Monaco, { OnChange } from "@monaco-editor/react";
import { classNames } from "../../utils/classNames";
import { SupportedLanguage } from "../../types";

export interface EditorProps {
  defaultValue?: string;
  path?: string;
  value?: string;
  onChange?: OnChange;

  language?: SupportedLanguage;
  defaultLanguage?: SupportedLanguage;

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
