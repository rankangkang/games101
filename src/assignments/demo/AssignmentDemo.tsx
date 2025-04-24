import { Playground } from "../../components/Playground/Playground";
import html from "./index.html?raw";
import js from "./main.js?raw";
import { FileModel, MimeType } from "../../types";
import { syncFileModels } from "../../db";
import { use } from "react";

export function AssignmentDemo() {
  const models = use(modelsPromise);
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

const modelsPromise = syncFileModels(defaultModels);
