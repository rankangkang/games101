import { getExtName } from '../utils/ext'

export function getFileIcon(path: string) {
  const ext = getExtName(path)
  switch (ext) {
    case 'html':
      return '🌐'
    case 'css':
      return '🎨'
    case 'js':
    case 'ts':
      return '📜'
    case 'jsx':
    case 'tsx':
      return '⚛️'
    case 'json':
      return '📋'
    case 'md':
      return '📝'
    default:
      return '📄'
  }
}
