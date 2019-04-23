module.exports = (api) => {
  api.cache(true);

  const env = process.env.NODE_ENV;

  const presets = [
    [
      '@babel/env',
      {
        modules: env === 'test' ? 'commonjs' : false,
        corejs: 2,
        loose: true,
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
