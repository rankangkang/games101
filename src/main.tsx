import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HelloWorld from "./entry.mdx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelloWorld />
  </StrictMode>
);
