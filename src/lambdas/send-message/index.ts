import { sendMessage } from '../../core/utils/send-message.util';
import { log } from '../../core/utils/logger.util';
import { handleError } from '../../core/utils/error-handler.util';

export const handler = async (event: any) => {
  try {
    log('send message lambda event: ', JSON.stringify(event));

    await sendMessage(event.id, event.message, event.inlineKeyboard);

    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (error) {
    await handleError('send message lambda handler', error);

    return {
      statusCode: 200,
      body: 'NOT OK',
    };
  }
};
