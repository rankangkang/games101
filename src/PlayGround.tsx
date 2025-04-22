// 组合 编辑器 和 游戏
import { useMemo, useState } from "react";
import { Code } from "./components/Code/Code";
import { FileModel } from "./components/Editor/Editor";
import Sandbox from "./components/Sandbox/Sandbox";
import { generateImportMap } from "./components/Sandbox/utils";

const gameHtml = /* html */ `
<!DOCTYPE html>
<html>
  <head>
    <title>Game</title>
  </head>
  <body>
    <div id="game-container"></div>
    <script type="text/javascript">
      console.log('run js');
    </script>
    <script type="module">
      import './main.js'
    </script>
  </body>
</html>
`;

const gameJs = /* javascript */ `
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

  const importMap = generateImportMap(
    models.filter((item) => item.type === "javascript")
  )

  return (
    <div>
      <Sandbox
        className="w-full h-[300px]"
        html={html}
        importMap={importMap}
        scripts={js}
        styles={css}
      />
      <Code models={models} onModelChange={setModels} />
    </div>
  );
}
