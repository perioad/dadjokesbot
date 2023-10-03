import { sendMessage } from '../../core/utils/send-message.util';
import { log } from '../../core/utils/logger.util';
import { handleError } from '../../core/utils/error-handler.util';

export const handler = async (event: any) => {
  try {
    log('send jokes lambda event: ', JSON.stringify(event));

    await sendMessage(event.id, event.joke.joke);

    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (error) {
    await handleError('send jokes lambda handler', error);
  }
};
