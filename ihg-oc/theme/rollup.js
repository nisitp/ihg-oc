const rollup = require('rollup');
const { uglify } = require('rollup-plugin-uglify');

(async () => {
	const bundle = await rollup.rollup({
		input: './src/scripts/index.js',
		plugins: [
			uglify()
                       // ... etc
		],
	});
    await bundle.write({
        file: 'dist/scripts/index.min.js',
        format: 'iife'
        // ... etc
    });
})();
