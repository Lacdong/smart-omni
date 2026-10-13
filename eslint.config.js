import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['.agents/**', 'dist/**', 'node_modules/**', 'artifacts/**', 'playwright-report/**', 'test-results/**'] },
  js.configs.recommended,
  {
    files: ['src/**/*.{js,jsx}', 'tests/**/*.js'],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } }, globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  { files: ['src/shared/ui/**/*.jsx'], rules: { 'react-refresh/only-export-components': 'off' } },
  { files: ['vite.config.js', 'playwright.config.js', 'eslint.config.js'], languageOptions: { globals: globals.node } },
]
