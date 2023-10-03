import { random } from 'lodash-es';
import { LISTENING_MESSAGES } from '../telegram/telegram.constants';

export const getRandomReply = () => {
  const maxIndex = LISTENING_MESSAGES.length - 1;

  return LISTENING_MESSAGES[random(0, maxIndex)];
};
