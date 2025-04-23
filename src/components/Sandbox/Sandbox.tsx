import React, { useRef, useMemo, useReducer, useImperativeHandle } from "react";
interface SandboxProps {
  ref?: React.RefObject<SandboxRef>;
  html?: string;
  importMap?: string;
  styles?: string | string[];
  scripts?: string | string[];
  width?: string | number;
  height?: string | number;
  title?: string;

  className?: string;
  style?: React.CSSProperties;
}

export interface SandboxRef {
  forceUpdate: () => void;
}

const Sandbox: React.FC<SandboxProps> = (props: SandboxProps) => {
  const {
    ref,
    html = "",
    styles = "",
    scripts = "",
    width = "100%",
    height = "100%",
    title = "Sandbox",
    className,
    style,
    importMap = "",
  } = props;

  const [count, update] = useReducer((state) => state + 1, 0);

  useImperativeHandle(ref, () => ({
    forceUpdate: update,
  }));

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 生成完整的 HTML 内容
  const fullHtml = useMemo(() => {
    const parser = new DOMParser();
    const nextDoc = parser.parseFromString(html, "text/html");
    const head = nextDoc.head;

    // 将 count 作为注释，强制刷新
    const countComment = document.createComment(`rerender count: ${count}`);
    head.appendChild(countComment);

    if (importMap) {
      // 插入 importmap
      const importMapTag = document.createElement("script");
      importMapTag.type = "importmap";
      importMapTag.innerHTML = importMap;
      head.appendChild(importMapTag);
    }

    if (styles && styles.length) {
      // 添加样式到 head 中
      const styleList = Array.isArray(styles) ? styles : [styles];
      styleList.forEach((style) => {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = style;
        head.appendChild(styleTag);
      });
    }

    if (scripts && scripts.length) {
      // 添加脚本到 body 中
      const scriptList = Array.isArray(scripts) ? scripts : [scripts];
      scriptList.forEach((script) => {
        const scriptTag = document.createElement("script");
        scriptTag.type = "module";
        scriptTag.innerHTML = script;
        nextDoc.body.appendChild(scriptTag);
      });
    }

    return nextDoc.documentElement.outerHTML;
  }, [html, styles, scripts, importMap, count]);

  return (
    <iframe
      className={className}
      style={style}
      ref={iframeRef}
      title={title}
      width={width}
      height={height}
      srcDoc={fullHtml}
      sandbox="allow-scripts allow-same-origin allow-modals allow-popups allow-presentation"
      allow={"serviceworker"}
    />
  );
};

export default Sandbox;
