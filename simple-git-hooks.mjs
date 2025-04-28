export default {
  'pre-commit': 'npx lint-staged -c ./lint-staged.config.mjs',
  'commit-msg': 'npx --no-install commitlint --edit "$1"',
}
