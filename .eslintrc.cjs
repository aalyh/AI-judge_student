/**
 * eslint doc:
 * @link  https://eslint.org/docs/latest/use/getting-started
 */
module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
    "eslint:recommended",
    "plugin:vue/vue3-essential",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
        'prettier',
        './.eslintrc-auto-import.json',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        ecmaVersion: 'latest',
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['vue', '@typescript-eslint', 'prettier','prettier/recommended'],
    rules: {
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-var-requires': 'off',
    },
};