import cmkk from '@cmkk/eslint-config'

export default cmkk({
  typescript: true,
  react: true,
  jsx: true,
  node: false,
  prettier: true,

  rules: {
    'ts/no-use-before-define': 'off',
  },
})
