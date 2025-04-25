import { CodeSandbox } from "../../components/CodeSandbox/CodeSandbox";
import html from "./index.html?raw";
import js from "./main.js?raw";
import readme from "./README.md?raw";
import { FileModel, MimeType } from "../../types";
import { syncFileModels } from "../../db";
import { join } from "../../utils/path";
import { ASSIGNMENTS_BASE_PREFIX } from "../../config";
import { use } from "react";

export function Assignment00() {
  const models = use(modelsPromise);
  return <CodeSandbox models={models} baseUrl={baseUrl} />;
}

const baseUrl = join(ASSIGNMENTS_BASE_PREFIX, "00");

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
  {
    type: MimeType.Markdown,
    value: readme,
    path: "README.md",
    baseUrl,
  },
];

const modelsPromise = syncFileModels(defaultModels);

