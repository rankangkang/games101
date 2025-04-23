import { use, useEffect } from "react";
import { Playground } from "./components/Playground/PlayGround";
import html from "./tmp/index.html?raw";
import js from "./tmp/main.js?raw";
import { FileModel, MimeType } from "./types";
import { idb } from "./db";
import { getStoragePath } from "./utils/path";

let modelPromise: Promise<FileModel[]> | null = null;

export function PA0() {
  modelPromise = modelPromise ?? getModels(defaultModels);

  useEffect(
    () => () => {
      modelPromise = null;
    },
    []
  );

  const models = use(modelPromise);

  return <Playground models={models.filter(Boolean)} />;
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

async function getModels(models: FileModel[]) {
  return Promise.all(
    models.map(async (item) => {
      const key = getStoragePath(item.path);
      let model = await idb.getFileModel(key);
      if (!model) {
        model = item;
        await idb.setFileModel(key, model);
      }
      return model;
    })
  );
}
