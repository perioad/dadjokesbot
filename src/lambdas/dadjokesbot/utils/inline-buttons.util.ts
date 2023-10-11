import { InlineKeyboard } from 'grammy';
import { CallbackAction } from '../telegram/telegram.constants';

export const getVoteInlineButtons = (
  jokeId: string,
  isVotingAvailable: boolean,
  isExplanationAvailable: boolean,
) => {
  const voting = isVotingAvailable ? 'y' : '';
  const explanation = isExplanationAvailable ? 'y' : '';

  return [
    InlineKeyboard.text(
      '👍',
      `${jokeId}:${CallbackAction.Upvote}:${voting}:${explanation}`,
    ),
    InlineKeyboard.text(
      '👎',
      `${jokeId}:${CallbackAction.Downvote}:${voting}:${explanation}`,
    ),
  ];
};

export const getExplainInlineButton = (
  jokeId: string,
  isVotingAvailable: boolean,
  isExplanationAvailable: boolean,
) => {
  const voting = isVotingAvailable ? 'y' : '';
  const explanation = isExplanationAvailable ? 'y' : '';

  return [
    InlineKeyboard.text(
      'Explain this joke, dad',
      `${jokeId}:${CallbackAction.Explain}:${voting}:${explanation}`,
    ),
  ];
};
