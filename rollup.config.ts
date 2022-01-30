import run from '@rollup/plugin-run';

import json from '@rollup/plugin-json';

import typescript from 'rollup-plugin-typescript2';
import tsConfigPaths from 'rollup-plugin-ts-paths';

import { terser } from 'rollup-plugin-terser';

const dev = process.env.ROLLUP_WATCH === 'true';

import pkg from './package.json';

const plugins = [dev && run(), json(), typescript(), tsConfigPaths(), terser()];

const entry = 'src/index.ts';

const external = [
	...Object.keys(pkg.dependencies || {}),
	...Object.keys(pkg.devDependencies || {}),
];

const banner = `
  /**
   * @license
   * author: ${pkg.author.name}
   * ${pkg.name}.js v${pkg.version}
   * Released under the ${pkg.license} license.
   */
`;

/**
 * @type {import('rollup').RollupOptions}
 */
export default [
	{
		input: entry,
		output: {
			file: pkg.main,
			format: 'cjs',
			sourcemap: 'inline',
			banner,
			exports: 'default',
		},
		external,
		plugins,
	},
	{
		input: entry,
		output: {
			file: pkg.module,
			format: 'es',
			sourcemap: 'inline',
			banner,
			exports: 'default',
		},
		external,
		plugins,
	},
];
