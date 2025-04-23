import { IDBOptions } from "./db/idb";

export const defaultImportMap = {
  imports: {
    three: "https://esm.sh/three@0.175.0",
    "three/": "https://esm.sh/three@0.175.0/",
  },
};

export const SERVICE_WORKER_PATH = "/sw.js";
export const SERVICE_WORKER_SCOPE_PREFIX = "/sw";

export const IDB_OPTIONS: IDBOptions = {
  name: "games101",
  storeName: "games101_assignments_storage",
  version: 1,
};
