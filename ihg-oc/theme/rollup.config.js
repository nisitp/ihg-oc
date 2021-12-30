import {terser} from 'rollup-plugin-terser';

export default {
    input: './src/scripts/index.js',
    plugins: [terser()],
    output: {
        file: './dist/scripts/index.min.js',
        format: 'iife',
        name: 'bundle',
        sourcemap: 'inline',
    }
}
