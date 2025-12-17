import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import unusedImports from 'eslint-plugin-unused-imports'

const eslintConfig = [
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn', // Changed from error to warn
      'react-hooks/immutability': 'warn', // Changed from error to warn
      '@next/next/no-img-element': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn', // Changed from error to warn
      '@typescript-eslint/no-this-alias': 'warn', // Changed from error to warn
      '@typescript-eslint/no-unused-expressions': 'warn', // Changed from error to warn
      '@typescript-eslint/no-require-imports': 'warn', // Changed from error to warn
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': 'error',
      'curly': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'node_modules/**',
      'next-env.d.ts',
      'public/opencv.js',
      'deps/**', // Ignore vendor opencv files
    ],
  },
]

export default eslintConfig
