import { z } from 'zod';

const CRON_REGEX = /(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})/;

const channel = z.object({
	channelName: z.string().optional(),
	channelId: z.string().optional(),
});

export default z.object({
	channels: z.array(channel),
	cron: z.string().regex(CRON_REGEX).optional(),
});
