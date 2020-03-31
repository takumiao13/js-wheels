import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/router.js',
    format: 'umd',
    name: 'router',
    exports: 'named'
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};