import type { TopicPlugin } from '../types';
import { defaultPlugin } from './default';
import { musicPlugin } from './music';

export const TOPIC_PLUGINS: Record<string, TopicPlugin> = {
  default: defaultPlugin,
  music: musicPlugin,
};

export function getPlugin(topicId: string): TopicPlugin {
  return TOPIC_PLUGINS[topicId] ?? TOPIC_PLUGINS['default'] ?? defaultPlugin;
}
