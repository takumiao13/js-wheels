import babel from 'rollup-plugin-babel';

export default [{
  input: 'src/v1/index.js',
  output: {
    file: 'dist/async-queue-v1.js',
    format: 'umd',
    name: 'AsyncQueue'
  },
  plugins: [
    babel()
  ],
}, {
  input: 'src/v2/index.js',
  output: {
    file: 'dist/async-queue-v2.js',
    format: 'umd',
    name: 'AsyncQueue'
  },
  plugins: [
    babel()
  ],  
}]