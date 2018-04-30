import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';
import pkg from './package.json';

const minify = process.env.MINIFY;
const format = process.env.FORMAT;

const umd = format === 'umd';

const config = {
  input: 'src/index.js',
  output: {
    file: `dist/redux-rest-easy.${format}${minify ? '.min' : ''}.js`,
    format,
    ...(umd
      ? {
          name: 'ReduxRestEasy',
          indent: false,
          globals: {
            react: 'React',
            'react-redux': 'ReactRedux',
          },
        }
      : {}),
  },
  external: [
    ...(!umd ? Object.keys(pkg.dependencies || {}) : []),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
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
    umd
      ? replace({
          'process.env.NODE_ENV': JSON.stringify(
            minify ? 'production' : 'development',
          ),
        })
      : null,
    minify
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
