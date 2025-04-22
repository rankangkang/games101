import React, { useEffect, useRef } from "react";

interface SandboxProps {
  html: string;
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
  } = props;

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    if (!iframeDoc) return;

    const fullHtml = generateFullHtml({
      html,
      styles,
      scripts,
      title,
      importmap,
    });
    iframeDoc.open();
    iframeDoc.write(fullHtml);
    iframeDoc.close();
  }, [html, styles, scripts, title]);

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

const importmap = {
  imports: {
    three: "https://esm.sh/three@0.175.0",
    "three/": "https://esm.sh/three@0.175.0/",
  },
};

function generateFullHtml(
  config: {
    html?: string;
    styles?: string | string[];
    scripts?: string | string[];
    title?: string;
    importmap?: Record<string, unknown>;
  } = {}
) {
  const { html, styles, scripts, title = "Sandbox", importmap } = config;

  const scriptList = Array.isArray(scripts) ? scripts : [scripts];
  const scriptContent = scriptList
    .map((script) => `<script type="module">${script}</script>`)
    .join("\n");

  const importmapContent = importmap
    ? `<script type="importmap">${JSON.stringify(importmap)}</script>`
    : "";

  const stylesList = Array.isArray(styles) ? styles : [styles];
  const stylesContent = stylesList
    .map((style) => `<style>${style}</style>`)
    .join("\n");

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${stylesContent}
    ${importmapContent}
  </head>
  <body>
    ${html}
    ${scriptContent}
  </body>
</html>`;
}
