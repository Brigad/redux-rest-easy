module.exports = (api) => {
  const env = api.env();

  const presets = [
    [
      '@babel/env',
      {
        modules: env === 'test' ? 'commonjs' : false,
        loose: true,
        corejs: 3,
        useBuiltIns: env !== 'test' ? 'entry' : 'usage',
        ...(env !== 'test' ? { targets: { browsers: 'ie >= 11' } } : {}),
      },
    ],
    '@babel/react',
  ];

  const plugins = ['@babel/proposal-class-properties'];

  return {
    presets,
    plugins,
  };
};
