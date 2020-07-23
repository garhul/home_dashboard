module.exports = {
  extends: [
    'airbnb-base',
    'plugin:security/recommended',
  ],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    indent: [2, 2],
    'linebreak-style': 0,
    'max-len': ['error', { code: 140 }],
    'object-curly-newline': 0,
  },
  plugins: [
    'security',
  ],
  env: {
    node: true,
    mocha: true,
  },
};
