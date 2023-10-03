import {
  InvokeCommand,
  InvokeCommandInput,
  LambdaClient,
} from '@aws-sdk/client-lambda';
import { db } from '../../../core/database/database';
import { log } from '../../../core/utils/logger.util';
import { Joke } from './models/joke.interface';
import { handleError } from '../../../core/utils/error-handler.util';

export const getJoke = async (
  jokesIds: string[],
): Promise<Joke | undefined> => {
  try {
    log('getting joke');

    const response = await fetch('https://icanhazdadjoke.com', {
      headers: {
        'User-Agent': 'Telegram bot (@jokes_by_dad_bot). Contacts: @perioad',
        Accept: 'application/json',
      },
    });
    const joke = (await response.json()) as Joke;
    const isOldJoke = jokesIds?.find(id => id === joke.id);

    if (isOldJoke) {
      log('old joke');

      return await getJoke(jokesIds);
    }

    log('success getting joke');

    return joke;
  } catch (error) {
    await handleError('getJoke', error);
  }
};

export const sendJokes = async (): Promise<void> => {
  try {
    log('sending jokes');

    const allActiveUsersIds = await db.getAllActiveUsersIds();
    const allJokesIds = await db.getAllJokesIds();

    if (!allActiveUsersIds || !allJokesIds) {
      throw `Send jokes error. allActiveUsersIds: ${allActiveUsersIds}; allJokesIds: ${allJokesIds}`;
    }

    const joke = await getJoke(allJokesIds);

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
