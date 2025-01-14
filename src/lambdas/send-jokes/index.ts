import { log } from '../../core/utils/logger.util';
import { handleError } from '../../core/utils/error-handler.util';
import { usersDB } from '../../core/database/users-database';
import {
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { jokesDB } from '../../core/database/jokes-database';
import {
  getExplainInlineButton,
  getVoteInlineButtons,
} from '../dadjokesbot/utils/inline-buttons.util';
import { getAnniversaryMessage } from './anniversary';
import { delay } from '../../core/utils/delay.util';

export const handler = async (event: any) => {
  try {
    log('send jokes lambda event: ', JSON.stringify(event));

    const allActiveUsersCurrentHours =
      await usersDB.getAllActiveUsersCurrentHours();

    if (!allActiveUsersCurrentHours) {
      throw new Error(`Send jokes error, no allActiveUsersCurrentHours`);
    }

    if (allActiveUsersCurrentHours.length === 0) {
      log('No active users found in current hour');

      return {
        statusCode: 200,
        body: 'OK',
      };
    }

    const lastJoke = await jokesDB.getLastJoke();

    if (!lastJoke) {
      throw new Error(`Send jokes error, no lastJoke`);
    }

    const lambdaClient = new LambdaClient({ region: process.env.REGION });

    for (const user of allActiveUsersCurrentHours) {
      log(`Sending joke to user ${user.id}`);

      const anniversaryMessage = getAnniversaryMessage(user.startDate);
      const jokeVoiceId = lastJoke.jokeVoiceId;

      let message = lastJoke.joke;

      if (anniversaryMessage) {
        message = `${anniversaryMessage}\n\nLet's celebrate with a new joke:\n\n${message}`;
      }

      const params: InvokeCommandInput = {
        FunctionName: process.env.SENDMESSAGE,
        InvocationType: 'Event',
        Payload: JSON.stringify({
          id: user.id,
          message,
          voiceMessageId: jokeVoiceId,
          inlineKeyboard: [
            getVoteInlineButtons(lastJoke.id, true, true),
            getExplainInlineButton(lastJoke.id, true, true),
          ],
        }),
      };

      await lambdaClient.send(new InvokeCommand(params));
      await delay(50);
    }

    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (error) {
    await handleError('send jokes lambda handler', error);

    return {
      statusCode: 200,
      body: 'NOT OK',
    };
  }
};
