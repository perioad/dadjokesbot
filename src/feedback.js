import { CONSTANTS } from './constants.js';
import { saveFeedback } from './database.js';
import { sendMessage } from './telegram.js';
import { log, handleError } from './utils.js';

const getFeedback = (message) => {
  const [, feedback] = message.split(CONSTANTS.COMMANDS.FEEDBACK);

  return feedback.trim();
};

const isFeedback = (feedback) => !!feedback;

export const handleFeedback = async (message) => {
  try {
    log('handling feedback');

    const feedback = getFeedback(message.text);

    if (!isFeedback(feedback)) {
      await sendMessage(message.chat.id, CONSTANTS.MESSAGES.NO_FEEDBACK);

      return;
    }

    await saveFeedback(message.chat.id, feedback);
    await sendMessage(message.chat.id, CONSTANTS.MESSAGES.THANKS_FEEDBACK);

    log('success handling feedback');
  } catch (error) {
    handleError('handleFeedback', error);
  }
};
