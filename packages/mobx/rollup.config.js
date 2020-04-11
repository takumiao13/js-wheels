import babel from 'rollup-plugin-babel';

export default {
  input: 'src/mobx.js',
  output: {
    file: 'dist/mobx.js',
    format: 'umd',
    name: 'mobx'
  },
  plugins: [
    babel()
  ],
};