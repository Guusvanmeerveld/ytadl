import run from '@rollup/plugin-run';

import json from '@rollup/plugin-json';

import typescript from 'rollup-plugin-typescript2';

import { terser } from 'rollup-plugin-terser';

const dev = process.env.ROLLUP_WATCH === 'true';

import pkg from './package.json';

const plugins = [dev && run(), json(), typescript(), terser()];

const entry = 'src/index.ts';

const external = [
	...Object.keys(pkg.dependencies || {}),
	...Object.keys(pkg.devDependencies || {}),
	'events',
];

const banner = `
  /**
   * @license
   * author: ${pkg.author.name}
   * ${pkg.name} v${pkg.version}
   * Released under the ${pkg.license} license.
   */
`;

const options = {
	external,
	plugins,
};

const outputOptions = {
	exports: 'default',
	validate: true,
	sourcemap: true,
	banner,
};

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
	{
		...options,
		input: entry,
		output: {
			...outputOptions,
			file: pkg.main,
			format: 'cjs',
		},
	},
	{
		...options,
		input: entry,
		output: {
			...outputOptions,
			file: pkg.module,
			format: 'es',
		},
	},
];
