// .eslintrc.cjs
// 注意是 cjs，因为 vite 默认 esmodules 会报错
module.exports = {
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-typescript'
  ],
  overrides: [
  ],
  parserOptions: {
    // ecmaVersion: 'latest',
    // sourceType: 'module',
    // project: ['./tsconfig.json']
    ecmaVersion: 2020,
    parser: '@typescript-eslint/parser'
  },
  plugins: [
    'vue'
  ],
  rules: {
    'vue/multi-word-component-names': 'off'
  }
}
// module.exports = {
//     root: true,
//     env: {
//       node: true
//     },
//     extends: [
//       'plugin:vue/vue3-essential',
//       '@vue/standard',
//       '@vue/typescript/recommended'
//     ],
//     parserOptions: {
//       ecmaVersion: 2020,
//       parser: '@typescript-eslint/parser'
//     },
//     rules: {
//       'space-before-function-paren': 'off',
//       'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//       'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//       'vue/multi-word-component-names': 'off'
//     }
//   }