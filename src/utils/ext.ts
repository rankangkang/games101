export function getExtName(path: string) {
  const lastDotIndex = path.lastIndexOf(".");
  if (lastDotIndex === -1) {
    return "";
  }
  
  return path.slice(lastDotIndex + 1);
}
