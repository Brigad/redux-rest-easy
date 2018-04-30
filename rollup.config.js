import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const env = process.env.NODE_ENV;
const isUMD = env !== 'es' && env !== 'cjs';

const config = {
  input: 'src/index.js',
  output: !isUMD
    ? {
        format: env,
      }
    : {
        format: 'umd',
        name: 'ReduxRestEasy',
        indent: false,
        globals: {
          react: 'React',
          'react-redux': 'ReactRedux',
        },
      },
  external: !isUMD
    ? [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
      ]
    : Object.keys(pkg.peerDependencies || {}),
  context: 'window',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    babel({
      exclude: 'node_modules/**',
      plugins: ['external-helpers'],
    }),
    isUMD
      ? replace({
          'process.env.NODE_ENV': JSON.stringify(env),
        })
      : null,
    env === 'production'
      ? uglify({
          compress: {
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            warnings: false,
          },
        })
      : null,
  ].filter(Boolean),
};

export default config;
