module.exports = {
  extends: ['airbnb', 'prettier'],
  parser: 'babel-eslint',
  plugins: ['react'],
  rules: {
    'arrow-parens': ['error', 'as-needed', { requireForBlockBody: true }],
    'operator-linebreak': ['error', 'before'],
    'react/jsx-filename-extension': ['error', { extensions: ['.js'] }],
  },
  env: {
    browser: true,
    jest: true,
  },
};
