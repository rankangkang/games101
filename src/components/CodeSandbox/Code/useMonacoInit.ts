import { useMonaco } from '@monaco-editor/react'
import { useEffect } from 'react'

export function useMonacoInit() {
  const monaco = useMonaco()
  useEffect(() => {
    if (!monaco) return

    monaco.editor.defineTheme('dracula', DraculaTheme)
    monaco.editor.setTheme('dracula')
  }, [monaco])

  return monaco
}

const DraculaTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'ff79c6' },
    { token: 'string', foreground: 'f1fa8c' },
    { token: 'number', foreground: 'bd93f9' },
    { token: 'type', foreground: '8be9fd', fontStyle: 'italic' },
  ],
  colors: {
    'editor.foreground': '#f8f8f2',
    'editor.background': '#282a36',
    'editor.lineHighlightBackground': '#44475a',
    'editorCursor.foreground': '#f8f8f2',
    'editorWhitespace.foreground': '#424450',
  },
}
