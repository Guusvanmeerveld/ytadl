import { EventEmitter } from 'events';
import { z } from 'zod';

import ConfigSchema from './config';

export default class Listener extends EventEmitter {
	constructor(private config: z.infer<typeof ConfigSchema>) {
		super();

		this.config = ConfigSchema.parse(config);
	}
}
