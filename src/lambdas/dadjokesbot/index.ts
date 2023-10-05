import { bot } from './telegram/telegram.initialization';
import { webhookCallback } from 'grammy';
import './telegram/commands';
import { handleError } from '../../core/utils/error-handler.util';

// track anniversaries
// check status codes in tg bot and aws lambda
export const handler = async (event: any) => {
  try {
    return await webhookCallback(bot, 'aws-lambda', 'return')(event);
  } catch (error) {
    await handleError('handler', error);

    return {
      statusCode: 200,
      body: 'NOT OK',
    };
  }
};
