import {
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { db } from '../../../core/database/users-database';
import { log } from '../../../core/utils/logger.util';
import { handleError } from '../../../core/utils/error-handler.util';

export const sendJokes = async (): Promise<void> => {
  try {
    log('sending jokes');

    const allActiveUsersIds = await db.getAllActiveUsersIds();
    const allJokesIds = await db.getAllJokesIds();

    if (!allActiveUsersIds || !allJokesIds) {
      throw `Send jokes error. allActiveUsersIds: ${allActiveUsersIds}; allJokesIds: ${allJokesIds}`;
    }

    const joke = await getJoke(allJokesIds);

    if (!joke) {
      throw `For some reason joke is empty`;
    }

    for (const id of allActiveUsersIds || []) {
      const lambdaClient = new LambdaClient({ region: process.env.REGION });

      const params: InvokeCommandInput = {
        FunctionName: process.env.SENDJOKES,
        InvocationType: 'Event',
        Payload: JSON.stringify({
          id,
          joke,
        }),
      };

      await lambdaClient.send(new InvokeCommand(params));
    }

    log('success sending jokes');
  } catch (error) {
    await handleError('sendJokes', error);
  }
};
