import { z } from 'zod';

import { configItem } from '../config';

export interface Config {
	soundCloudToken?: string;
}

export type ConfigItem = z.output<typeof configItem>;
