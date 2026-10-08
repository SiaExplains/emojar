const react = require('eslint-plugin-react');
const globals = require('globals');
import { globalIgnores } from 'eslint/config';
import parser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';

module.exports = [
  {
    files: ['**/*.{js,jsx,mjs,cjs,ts,tsx}'],
    plugins: {
      react,
      prettier: prettierPlugin,
    },

    languageOptions: {
      parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: './tsconfig.json',
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'prettier/prettier': ['error'],
    },
  },
  globalIgnores([
    '**/.next/**',
    '**/scripts/**',
    // Vendored, generated builds (e.g. liblouis WebAssembly glue).
    'public/vendor/**',
    'node_modules/**',
    'dist/**',
    '.claude/**',
    'tailwind.config.ts',
    'postcss.config.mjs',
    'scripts/generate.js',
  ]),
];
