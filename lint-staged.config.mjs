export default {
  '**/*.{js,ts,jsx,tsx}': ['eslint --fix', 'prettier --write -u'],
  '!**/*.{js,ts,jsx,tsx}': 'prettier --write -u',
}
