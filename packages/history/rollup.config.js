import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/history.js',
    format: 'umd',
    name: 'createHistory'
  },
  plugins: [
    babel()
  ],
};