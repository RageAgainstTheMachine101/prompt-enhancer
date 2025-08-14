module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
    webextensions: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // Best Practices
    'eqeqeq': ['error', 'always'],
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-return-await': 'error',
    'require-await': 'error',
    'no-useless-concat': 'error',
    'prefer-promise-reject-errors': 'error',

    // Variables
    'no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'no-use-before-define': ['error', {
      functions: false,
      classes: true
    }],

    // Stylistic Issues
    'indent': ['error', 2, { SwitchCase: 1 }],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single', {
      avoidEscape: true,
      allowTemplateLiterals: true
    }],
    'semi': ['error', 'always'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'space-before-blocks': 'error',
    'keyword-spacing': 'error',
    'space-infix-ops': 'error',
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],

    // ES6
    'prefer-const': 'error',
    'no-var': 'error',
    'prefer-arrow-callback': 'warn',
    'prefer-template': 'warn',
    'no-useless-constructor': 'error',

    // Error Prevention
    'no-console': ['warn', {
      allow: ['warn', 'error', 'info']
    }],
    'no-debugger': 'error'
  },
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'coverage/',
    '*.min.js'
  ]
};
