// 组合 编辑器 和 游戏

import { Editor } from "./components/Editor";
import Sandbox from "./components/Sandbox";
import jsContent from "./assignments/0/main.js?raw";
import { useState } from "react";
import { Code } from "./components/Code";
const html = `
  <div>
    <canvas id="game-canvas"></canvas>
  </div>
`;

export function GameEditor() {
  const [js, setJs] = useState(jsContent);
  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <Sandbox html={html} scripts={js} />
        </div>
        <div style={{ flex: 1 }}>
          <Editor
            value={js}
            onChange={(val) => {
              setJs(val ?? "");
            }}
          />
        </div>
      </div>
      <Code
        models={[
          { path: "main.js", value: js, type: "javascript" },
          { path: "utils/index.js", value: js, type: "javascript" },
          {
            path: "components/Dialog/index.jsx",
            value: js,
            type: "javascript",
          },
          { path: "index.html", value: html, type: "html" },
        ]}
      />
    </div>
  );
}
