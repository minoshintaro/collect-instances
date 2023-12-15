module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: [
    '@typescript-eslint',
  ],
  globals: {
    figma: 'readonly'
  },
  rules: {
    "no-console": "warn",
    "no-unused-vars": "off",
    "indent": ["error", 2],
  },
};
