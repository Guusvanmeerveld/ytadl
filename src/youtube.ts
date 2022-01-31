import axios from 'axios';
import ytdl, { Filter } from 'ytdl-core';
import { parseStringPromise } from 'xml2js';

import { streamOptions } from './config';

import { Entry, YoutubeFeed } from './interfaces/youtube';
import { FeedItem } from './interfaces/feed';

export const findChannelIdByName = async (name: string): Promise<string | void> => {
	const { data } = await axios.get<string>(`https://youtube.com/c/${name}`);

	const match =
		data.match(/"externalId":"([\w-]+)"/) || data.match(/channel-external-id="([\w-]+)"/);

	if (match) {
		return match[1];
	}
};

export const fetchFeedById = async (channelId: string): Promise<FeedItem[]> => {
	const { data } = await axios.get('https://www.youtube.com/feeds/videos.xml', {
		params: {
			channel_id: channelId,
		},
	});

	const json: YoutubeFeed = await parseStringPromise(data);

	const feed = json.feed.entry;

	return feed.map(YtItemtoFeedItem);
};

const YtItemtoFeedItem = (item: Entry): FeedItem => {
	const url = item.link.map((item) => item.$.href)[0];

	return {
		channel: item.author.map((item) => item.name.join(''))[0],
		platform: 'youtube',
		id: item['yt:videoId'][0],
		title: item.title[0],
		url,
		stream: async (options) => {
			const parsed = streamOptions.parse(options);

			let filter: Filter = 'audioandvideo';

			if (!(parsed?.audio?.included && parsed?.video?.included)) {
				if (parsed?.audio?.included) {
					filter = 'audioonly';
				}

				if (parsed?.video?.included) {
					filter = 'videoonly';
				}
			}

			return ytdl(url, { filter });
		},
	};
};
