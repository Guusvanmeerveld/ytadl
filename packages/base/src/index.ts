import { EventEmitter } from 'events';

import { z } from 'zod';

import schedule from 'node-schedule';

import ConfigSchema from './config';

import { fetchFeedById, findChannelIdByName } from './youtube';

import Emitter from './interfaces/emitter';
import { FeedItem } from './interfaces/feed';
import { Config, ConfigItem } from './interfaces/config';

export default class ytadl extends (EventEmitter as Emitter) {
	private data: Record<string, string[]> = {};
	private schema: z.output<typeof ConfigSchema>;

	/**
	 * Creates a new ytadl listener
	 * @param schema The input schema, an array of objects with each a name property with the channel name to listen for.
	 * @param config An optional config containing tokens or general settings
	 */
	constructor(schema: z.input<typeof ConfigSchema>, private config?: Config) {
		super();

		this.schema = ConfigSchema.parse(schema);

		this.init();
	}

	private init = async () => {
		this.schema = await Promise.all(
			this.schema.map(async (item) => {
				if (item.id || !item.name) return item;

				switch (item.platform) {
					case 'youtube':
						const id = await findChannelIdByName(item.name);

						if (!id) return item;

						return { ...item, id };
				}

				return item;
			})
		);

		for (const item of this.schema) {
			const job = schedule.scheduleJob(item.cron, async () => {
				if (!item.id) return;

				const [ids, feed] = await this.fetch(item);

				const difference = this.data[item.id].filter((i) => !ids.includes(i));

				this.data[item.id] = ids;

				if (difference.length > 0) {
					difference.forEach((feedItem) =>
						this.emit('newItem', feed.find(({ id }) => id == feedItem) as FeedItem, item)
					);
				}
			});

			if (!item.id) return;

			const [ids] = await this.fetch(item);

			this.data[item.id] = ids;

			job.on('run', () => this.emit('jobRan', item));
		}
	};

	private fetch = async (item: ConfigItem): Promise<[string[], FeedItem[]]> => {
		if (!item.id) throw new Error('Channel does not have an id');

		let feed: FeedItem[] | undefined;

		switch (item.platform) {
			case 'youtube':
				feed = await fetchFeedById(item.id);
				break;
		}

		if (!feed) throw new Error('Could not fetch remote feed');

		return [feed.map((i) => i.id), feed];
	};
}
