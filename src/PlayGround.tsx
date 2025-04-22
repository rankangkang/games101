// 组合 编辑器 和 游戏
import { useMemo, useState } from "react";
import { Code } from "./components/Code/Code";
import { FileModel } from "./components/Editor/Editor";
import Sandbox from "./components/Sandbox/Sandbox";

const gameHtml = /* html */ `<div id="game-container">
</div>`;

const gameJs = /* javascript */ `
// 使用 three.js 创建一个 3D 场景, 并添加一个立方体,绘制到 game-canvas 上
import { Scene, PerspectiveCamera, BoxGeometry, MeshBasicMaterial, Mesh, WebGLRenderer } from 'three';

const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const geometry = new BoxGeometry(1, 1, 1);
const material = new MeshBasicMaterial({ color: 0x00ff00 });
const cube = new Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('game-container');
container?.appendChild(renderer.domElement);

renderer.render(scene, camera);
console.log('Game initialized');
`;

export function PlayGround() {
  const [models, setModels] = useState<FileModel[]>([
    { path: "main.js", value: gameJs, type: "javascript" },
    { path: "index.html", value: gameHtml, type: "html" },
  ]);

  const { html, js, css } = useMemo(() => {
    return {
      html: models.find((model) => model.type === "html")?.value,
      js: models.find((model) => model.type === "javascript")?.value,
      css: models.find((model) => model.type === "css")?.value,
    };
  }, [models]);

  return (
    <div>
      <Sandbox
        className="w-full h-[300px]"
        html={html}
        scripts={js}
        styles={css}
      />
      <Code models={models} onModelChange={setModels} />
    </div>
  );
}
