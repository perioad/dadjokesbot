import { sendMessage } from '../../core/utils/send-message.util';
import { log } from '../../core/utils/logger.util';
import { handleError } from '../../core/utils/error-handler.util';
import { usersDB } from '../../core/database/users-database';
import { sendMessageToAdmin } from '../../core/utils/admin-message.util';

export const handler = async (event: any) => {
  try {
    log('send message lambda event: ', JSON.stringify(event));

    await sendMessage(
      event.id,
      event.message,
      event.voiceMessageId,
      event.inlineKeyboard,
    );

    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (error: any) {
    if (
      error?.description
        ?.toLowerCase()
        ?.includes('forbidden: user is deactivated') &&
      error?.payload?.chat_id
    ) {
      await usersDB.deactivateUser(Number(error.payload.chat_id));
      await sendMessageToAdmin(
        `Deactivated deactivated user with id: ${error.payload.chat_id}`,
      );
    }

    await handleError('send message lambda handler', error);

    return {
      statusCode: 200,
      body: 'NOT OK',
    };
  }
};
