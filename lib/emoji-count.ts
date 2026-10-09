// Number of emojis in the dataset, for server-rendered copy. Import only from
// server code (layouts, pages, routes): the dataset is large and must not be
// pulled into client bundles just for a number.
import data from '@/data/emojis.json';

export const EMOJI_COUNT = (data as unknown[]).length;
export const EMOJI_COUNT_LABEL = EMOJI_COUNT.toLocaleString('en-US');
