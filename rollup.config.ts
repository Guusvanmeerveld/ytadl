import run from '@rollup/plugin-run';

import json from '@rollup/plugin-json';

import typescript from 'rollup-plugin-typescript2';
import tsConfigPaths from 'rollup-plugin-ts-paths';

import { terser } from 'rollup-plugin-terser';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'cjs',
	},
	external: [],
	plugins: [dev && run(), json(), typescript(), tsConfigPaths(), terser()],
};
