import { log } from '../../core/utils/logger.util';
import { handleError } from '../../core/utils/error-handler.util';
import { usersDB } from '../../core/database/users-database';
import {
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { jokesDB } from '../../core/database/jokes-database';

export const handler = async (event: any) => {
  try {
    log('send jokes lambda event: ', JSON.stringify(event));

    const allActiveUsersIds = await usersDB.getAllActiveUsersIds();
    const lastJoke = await jokesDB.getLastJoke();

    if (!allActiveUsersIds || !lastJoke) {
      throw `Send jokes error. allActiveUsersIds: ${allActiveUsersIds}; lastJoke: ${lastJoke}`;
    }

    const lambdaClient = new LambdaClient({ region: process.env.REGION });

    for (const id of allActiveUsersIds || []) {
      const params: InvokeCommandInput = {
        FunctionName: process.env.SENDMESSAGE,
        InvocationType: 'Event',
        Payload: JSON.stringify({
          id,
          message: lastJoke.joke,
        }),
      };

      await lambdaClient.send(new InvokeCommand(params));
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
