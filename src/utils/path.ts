/**
 * 将路径拼接成一个完整的 URL，浏览器端使用，去除重复的斜杠
 * @param paths 路径
 * @returns 完整的 URL
 */
export function join(...paths: (string | undefined | null)[]) {
  return paths.filter(Boolean).join('/').replace(/\/+/g, '/')
}
