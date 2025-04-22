export function join(...paths: string[]) {
  // 将路径拼接成一个完整的 URL，浏览器端使用，去除重复的斜杠
  return paths.join("/").replace(/\/+/g, "/");
}
