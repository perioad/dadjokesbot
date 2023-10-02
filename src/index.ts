import { bot } from './telegram/telegram.initialization';
import { webhookCallback } from 'grammy';
import './telegram/commands';
import { sendMessageToAdmin } from './telegram/telegram.utils';
import { NL } from './telegram/telegram.constants';
import { handleError } from './utils/error-handler.util';
import { sendJokes } from './jokes/jokes';

// track anniversaries
// await errors
export const handler = async (event: any) => {
  try {
    const { source } = event;

    if (source === 'aws.events') {
      console.log('event', event);

      await sendJokes();

      return {
        statusCode: 200,
        body: 'OK',
      };
    }

    return await webhookCallback(bot, 'aws-lambda', 'return')(event);
  } catch (error) {
    await handleError('handler', error);
  }
};
