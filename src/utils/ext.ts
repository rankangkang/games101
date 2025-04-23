import { MimeType } from "../types";

export function getExtName(path: string) {
  const lastDotIndex = path.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return "";
  }

  return path.slice(lastDotIndex + 1);
}

export function mime2Lang(mime: MimeType) {
  switch (mime) {
    case MimeType.JavaScript:
      return "javascript";
    case MimeType.HTML:
      return "html";
    case MimeType.CSS:
      return "css";
    default:
      return undefined;
  }
}
