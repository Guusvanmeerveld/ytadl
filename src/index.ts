import { EventEmitter } from 'events';

import { z } from 'zod';

import schedule from 'node-schedule';

import ConfigSchema, { configItem } from './config';

import { fetchFeedById, findChannelIdByName } from './youtube';

import TypedEmitter from './interfaces/emitter';
import { FeedItem } from './interfaces/feed';

type ConfigItem = z.output<typeof configItem>;

type EmitMap = {
	newItem: (item: FeedItem) => void;
	jobRan: (config: ConfigItem) => void;
};

export default class ytadl extends (EventEmitter as new () => TypedEmitter<EmitMap>) {
	private data: Record<string, string[]> = {};
	private config: z.output<typeof ConfigSchema>;

	constructor(config: z.input<typeof ConfigSchema>) {
		super();

		this.config = ConfigSchema.parse(config);

		this.init();
	}

	private init = async () => {
		this.config = await Promise.all(
			this.config.map(async (item) => {
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

		for (const item of this.config) {
			const job = schedule.scheduleJob(item.cron, async () => {
				if (!item.id) return;

				const [ids, feed] = await this.fetch(item);

				const difference = this.data[item.id].filter((i) => !ids.includes(i));

				if (difference.length > 0) {
					difference.forEach((feedItem) =>
						this.emit('newItem', feed.find(({ id }) => id == feedItem) as FeedItem)
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
