module.exports = api => {
  api.cache(true);

  const env = process.env.NODE_ENV;

  const presets = [
    [
      '@babel/env',
      {
        modules: env === 'test' ? 'commonjs' : false,
        loose: true,
        ...(env !== 'test' ? { targets: { browsers: 'ie >= 11' } } : {}),
      },
    ],
    '@babel/react',
    [
      '@babel/preset-stage-2',
      {
        decoratorsLegacy: true,
      },
    ],
  ];

  return {
    presets,
  };
};
