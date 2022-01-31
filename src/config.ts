import { z } from 'zod';

const CRON_REGEX = /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/;

export const streamOptions = z.object({
	audio: z
		.object({
			included: z.boolean().optional(),
		})
		.optional(),
	video: z
		.object({
			included: z.boolean().optional(),
		})
		.optional(),
});

export const configItem = z.object({
	name: z.string().optional(),
	id: z.string().optional(),
	cron: z.string().regex(CRON_REGEX).optional(),
	platform: z.string().default('youtube'),
});

export default z.array(configItem);
