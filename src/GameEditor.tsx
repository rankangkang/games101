// 组合 编辑器 和 游戏

import { Editor } from "./components/Editor";
import Sandbox from "./components/Sandbox";
import jsContent from "./assignments/0/main.js?raw";
import { useState } from "react";

const html = `
  <div>
    <canvas id="game-canvas"></canvas>
  </div>
`;

// TODO: 支持多文件编辑
export function GameEditor() {
  const [js, setJs] = useState(jsContent);
  return (
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
  );
}
