import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

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
        plugins: [],
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
    ]
  }
];
