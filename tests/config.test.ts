import ConfigSchema from '../src/config';

import exampleConfig from '../example.config.json';

describe('Validate config', () => {
	test('It is valid', () => {
		expect(ConfigSchema.parse(exampleConfig)).toBeDefined();
	});
});
