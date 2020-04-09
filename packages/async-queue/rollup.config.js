import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/async-queue.js',
    format: 'umd',
    name: 'AsyncQueue'
  },
  plugins: [
    babel()
  ],
};