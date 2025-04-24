import { MimeType, SupportedLanguage } from "../types";

export function getExtName(path: string) {
  const lastDotIndex = path.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return "";
  }

  return path.slice(lastDotIndex + 1);
}

export function mime2Lang(mime: MimeType): SupportedLanguage | undefined {
  switch (mime) {
    case MimeType.JavaScript:
      return SupportedLanguage.JavaScript;
    case MimeType.HTML:
      return SupportedLanguage.HTML;
    case MimeType.CSS:
      return SupportedLanguage.CSS;
    case MimeType.ImportMap:
    case MimeType.JSON:
      return SupportedLanguage.JSON;
    default:
      return undefined;
  }
}
