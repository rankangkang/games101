export function replaceVariables(str: string, variables: Record<string, string>) {
  // 可能会包含多个，{{}} 内部可能也有空格
  return str.replace(/\{\{([^}]+)\}\}/g, (match, p1) => variables[p1.trim()] || match)
}
