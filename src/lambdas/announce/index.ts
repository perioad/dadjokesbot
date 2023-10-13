import { log } from '../../core/utils/logger.util';
import { handleError } from '../../core/utils/error-handler.util';
import { usersDB } from '../../core/database/users-database';
import {
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from '@aws-sdk/client-lambda';

export const handler = async (event: any) => {
  try {
    log('announce lambda event: ', JSON.stringify(event));

    const allActiveUsersIds = await usersDB.getAllActiveUsersIds();

    if (!allActiveUsersIds) {
      throw `Send jokes error, no allActiveUsersIds`;
    }

    const lambdaClient = new LambdaClient({ region: process.env.REGION });

    for (const id of allActiveUsersIds) {
      const params: InvokeCommandInput = {
        FunctionName: process.env.SENDMESSAGE,
        InvocationType: 'Event',
        Payload: JSON.stringify({
          id,
          message: event.message,
        }),
      };

      await lambdaClient.send(new InvokeCommand(params));
    }

    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (error) {
    await handleError('announce lambda handler', error);

    return {
      statusCode: 200,
      body: 'NOT OK',
    };
  }
};
