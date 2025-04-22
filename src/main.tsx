import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import HelloWorld from "./entry.mdx";
import "./styles/style.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelloWorld />
  </StrictMode>
);
