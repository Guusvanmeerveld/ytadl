import ConfigSchema from '../src/config';

import exampleConfig from '../example.config.json';

describe('Validate config', () => {
	test('It is valid', async () => {
		expect(await ConfigSchema.parse(exampleConfig)).toBeDefined();
	});
});
