import type { TopicPlugin, QuestionPack } from '../types';

export const musicPlugin: TopicPlugin = {
  id: 'music',
  name: 'Music',
  description: 'Guess the word from song lyrics or title. Pairs with Spotify for auto-playback.',
  icon: '🎵',
  supportsSpotify: true,
  supportsImageClues: false,
  renderQuestionClue: () => null,
  validatePack: (pack: QuestionPack): string[] => {
    const errors: string[] = [];
    pack.categories.forEach((cat) =>
      cat.questions.forEach((q) => {
        if (!q.songTitle) errors.push(`Question ${q.id} is missing songTitle`);
        if (!q.artist) errors.push(`Question ${q.id} is missing artist`);
      }),
    );
    return errors;
  },
};
