import { bot } from './telegram/telegram.initialization';
import { webhookCallback } from 'grammy';
import './telegram/commands';
import { sendJokes } from './jokes/jokes';
import { handleError } from '../../core/utils/error-handler.util';

// track anniversaries
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
