export interface FileModel {
  path: string;
  value: string;
  type: MimeType;
  baseUrl?: string;
}

export enum MimeType {
  JavaScript = "text/javascript",
  HTML = "text/html",
  CSS = "text/css",
  ImportMap = "application/importmap+json",
  JSON = "application/json",
}

export enum SupportedLanguage {
  JavaScript = "javascript",
  HTML = "html",
  CSS = "css",
  JSON = "json",
}
