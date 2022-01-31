import { fetchFeedById, findChannelIdByName } from '../src/youtube';

const exampleChannelName = 'Fireship';
const exampleChannelId = 'UCsBjURrPoezykLs9EqgamOA';

describe('Test fetching Youtube videos', () => {
	test('It returns a Youtube channel id', async () => {
		const actual = await findChannelIdByName(exampleChannelName);

		expect(actual).toBe(exampleChannelId);
	});

	test('It returns a list of Youtube videos', async () => {
		const actual = await fetchFeedById(exampleChannelId);

		expect(actual).toBeDefined();
	});

	test('It returns a readable stream', async () => {
		const items = await fetchFeedById(exampleChannelId);

		const actual = await items[0].stream();

		expect(actual).toBeDefined();
	});
});
