import compiler from '@ampproject/rollup-plugin-closure-compiler';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import replace from 'rollup-plugin-replace';
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
  context: "typeof window !== 'undefined' ? window : global",
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
    }),
    umd
      ? replace({
          'process.env.NODE_ENV': JSON.stringify(
            minify ? 'production' : 'development',
          ),
        })
      : null,
    minify
      ? compiler()
      : null,
  ].filter(Boolean),
};

export default config;
