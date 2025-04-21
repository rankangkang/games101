import { memo } from "react";
import Monaco, { OnChange } from "@monaco-editor/react";

export interface EditorProps {
  defaultValue?: string;
  value?: string;
  onChange?: OnChange;

  className?: string;
  style?: React.CSSProperties;
}

export const Editor = memo(function Editor(props: EditorProps) {
  const { value, defaultValue = value, onChange, className, style } = props;
  return (
    <div className={className} style={style}>
      <Monaco
        height="800px"
        language="javascript"
        defaultLanguage="javascript"
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
      />
    </div>
  );
});
