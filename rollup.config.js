import nodeResolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const env = process.env.NODE_ENV;

const config = {
  input: 'src/index.js',
  external: ['react', 'react-redux'],
  output: {
    name: 'ReduxRestEasy',
    format: 'umd',
    globals: {
      react: 'React',
      'react-redux': 'ReactRedux',
    },
  },
  plugins: [
    nodeResolve({
      preferBuiltins: true,
    }),
    builtins(),
    babel({
      exclude: '**/node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    commonjs(),
  ],
};

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false,
      },
    }),
  );
}

export default config;
