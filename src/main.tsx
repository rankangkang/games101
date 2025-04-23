import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HelloWorld from "./entry.mdx";
import "./styles/style.css";
import { registryServiceWorker } from "./utils/registryServiceWorker";
import { SERVICE_WORKER_PATH } from "./config";
import { idb } from "./db";

registryServiceWorker(SERVICE_WORKER_PATH).then(async () => {
  await idb.getDB();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <HelloWorld />
    </StrictMode>
  );
});
