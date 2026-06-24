import type { TopicPlugin } from '../types';

export const defaultPlugin: TopicPlugin = {
  id: 'default',
  name: 'General',
  description: 'Text-based questions for any topic',
  icon: '❓',
  supportsSpotify: false,
  supportsImageClues: false,
  renderQuestionClue: (question) => {
    if (!question.clue) return null;
    return <p className="question-clue">{question.clue}</p>;
  },
};
