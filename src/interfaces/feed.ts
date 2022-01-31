import { z } from 'zod';
import { Stream } from 'stream';

import { streamOptions } from '../config';

export type Platform = 'youtube';

export interface FeedItem {
	platform: Platform;
	title: string;
	channel: string;
	url: string;
	id: string;
	stream: (options?: z.input<typeof streamOptions>) => Promise<Stream>;
}
