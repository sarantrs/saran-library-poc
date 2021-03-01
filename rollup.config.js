import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import image from 'rollup-plugin-image';
const url = require('postcss-url');
export default [
  {
    input: './src/index.js',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.es.js',
        format: 'es',
        exports: 'named',
      }
    ],
    plugins: [
      postcss({
        plugins: [
          url({
          url: "inline", // enable inline assets using base64 encoding
          maxSize: 1000, // maximum file size to inline (in kilobytes)
          fallback: "copy", // fallback method to use if max size is exceeded
        })],
        minimize: true, 
        extract: true,
        modules: true,
        use: ['sass'],
      }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-react'],
        runtimeHelpers: true,
      }),
      external(),
      resolve(),
      terser(),
      image()
    ]
  }
];
