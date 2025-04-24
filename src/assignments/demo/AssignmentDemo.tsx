import { Playground } from "../../components/Playground/Playground";
import html from "./index.html?raw";
import js from "./main.js?raw";
import { FileModel, MimeType } from "../../types";
import { syncFileModels } from "../../db";
import { join } from "../../utils/path";
import { ASSIGNMENTS_BASE_PREFIX } from "../../config";
import { use } from "react";

export function AssignmentDemo() {
  const models = use(modelsPromise);
  return <Playground models={models} baseUrl={baseUrl} />;
}

const baseUrl = join(ASSIGNMENTS_BASE_PREFIX, "demo");

const defaultModels: FileModel[] = [
  {
    type: MimeType.HTML,
    value: html,
    path: "index.html",
    baseUrl,
  },
  {
    type: MimeType.JavaScript,
    value: js,
    path: "main.js",
    baseUrl,
  },
];

const modelsPromise = syncFileModels(defaultModels);

