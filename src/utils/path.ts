import { SERVICE_WORKER_SCOPE_PREFIX } from "../config";

export function join(...paths: string[]) {
  // 将路径拼接成一个完整的 URL，浏览器端使用，去除重复的斜杠
  return paths.join("/").replace(/\/+/g, "/");
}

export function getStoragePath(...args: string[]) {
  const nextArgs = [SERVICE_WORKER_SCOPE_PREFIX, ...args];
  return join(...nextArgs);
}
