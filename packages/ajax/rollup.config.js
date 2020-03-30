import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/ajax.js',
    format: 'umd',
    name: 'ajax'
  },
  plugins: [
    commonjs()
  ]
};