import { random } from 'lodash-es';
import { CONSTANTS } from './constants.js';
import { sendMessage } from './telegram.js';
import { log, handleError } from './utils.js';

const getRandomListeningMessage = () => {
  const maxIndex = CONSTANTS.LISTENING_MESSAGES.length - 1;

  return CONSTANTS.LISTENING_MESSAGES[random(0, maxIndex)];
};

export const sendListeningMessage = async (chatId) => {
  try {
    log('sending listening message', chatId);

    await sendMessage(chatId, getRandomListeningMessage());

    log('success sending listening message');
  } catch (error) {
    handleError('sendListeningMessage', error);
  }
};
