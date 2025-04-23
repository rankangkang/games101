export interface FileModel {
  path: string;
  value: string;
  type: MimeType;
}

export enum MimeType {
  JavaScript = "text/javascript",
  HTML = "text/html",
  CSS = "text/css",
}
