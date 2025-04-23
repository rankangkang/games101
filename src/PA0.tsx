import { use, useEffect } from "react";
import { Playground } from "./components/Playground/PlayGround";
import html from "./tmp/index.html?raw";
import js from "./tmp/main.js?raw";
import { FileModel, MimeType } from "./types";
import { idb } from "./db";
import { getStoragePath } from "./utils/path";

let modelPromise: Promise<FileModel[]> | null = null;

export function PA0() {
  modelPromise =
    modelPromise ??
    getModels(defaultModels.map((model) => getStoragePath(model.path)));

  useEffect(
    () => () => {
      modelPromise = null;
    },
    []
  );

  const models = use(modelPromise);

  // indexedDB 中可能存在已由内容，若存在，则使用已有的内容

  return <Playground models={models} />;
}

const defaultModels: FileModel[] = [
  {
    type: MimeType.HTML,
    value: html,
    path: "index.html",
  },
  {
    type: MimeType.JavaScript,
    value: js,
    path: "main.js",
  },
];

async function getModels(keys: string[]) {
  return Promise.all(
    keys.map(async (key) => {
      const model = await idb.getFileModel(key);
      return model!;
    })
  );
}
