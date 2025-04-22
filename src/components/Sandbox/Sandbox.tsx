import React, { useEffect, useRef } from "react";
import { generateFullHtml } from "./utils";
interface SandboxProps {
  // 直接指定 html 内容，该属性传递时，styles、scripts 内容会被忽略
  importMap?: string;

  // 其他内容
  html?: string;
  styles?: string | string[];
  scripts?: string | string[];
  width?: string | number;
  height?: string | number;
  title?: string;

  className?: string;
  style?: React.CSSProperties;
}

const Sandbox: React.FC<SandboxProps> = (props: SandboxProps) => {
  const {
    html,
    styles = "",
    scripts = "",
    width = "100%",
    height = "100%",
    title = "Sandbox",
    className,
    style,
    importMap = "",
  } = props;

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const nextHtml = html
      ? html
      : generateFullHtml({
          html,
          title,
        });

    const parser = new DOMParser();
    const nextDoc = parser.parseFromString(nextHtml, "text/html");
    const head = nextDoc.head;
    if (importMap) {
      // 插入 importmap
      const importMapTag = document.createElement("script");
      importMapTag.type = "importmap";
      importMapTag.innerHTML = importMap;
      head.appendChild(importMapTag);
    }

    if (styles.length) {
      // 添加样式到 head 中
      const styleList = Array.isArray(styles) ? styles : [styles];
      styleList.forEach((style) => {
        const styleTag = document.createElement("style");
        styleTag.innerHTML = style;
        head.appendChild(styleTag);
      });
    }

    if (scripts.length) {
      // 添加脚本到 body 中
      const scriptList = Array.isArray(scripts) ? scripts : [scripts];
      scriptList.forEach((script) => {
        const scriptTag = document.createElement("script");
        scriptTag.type = "module";
        scriptTag.innerHTML = script;
        nextDoc.body.appendChild(scriptTag);
      });
    }

    iframeDoc.open();
    iframeDoc.write(nextDoc.documentElement.outerHTML);

    iframeDoc.close();
  }, [html, styles, scripts, title, importMap]);

  return (
    <iframe
      className={className}
      style={style}
      ref={iframeRef}
      title={title}
      width={width}
      height={height}
      sandbox="allow-scripts allow-same-origin allow-modals"
    />
  );
};

export default Sandbox;
