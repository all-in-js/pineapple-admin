import esbuild from 'rollup-plugin-esbuild';
import pkg from './package.json';

export default {
  input: 'src/app.ts',
  output: {
    file: 'dist/app.js',
    format: 'cjs',
  },
  external: [...Object.keys(pkg.dependencies), ...Object.keys(pkg.devDependencies)],
  plugins: [
    esbuild({
      minify: false
    }),
  ],
}