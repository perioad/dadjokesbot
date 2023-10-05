import { log } from '../../core/utils/logger.util';
import { handleError } from '../../core/utils/error-handler.util';
import { getJoke } from './get-joke';
import { jokesDB } from '../../core/database/jokes-database';

export const handler = async () => {
  try {
    log('get joke lambda');

    const allJokesIds = await jokesDB.getAllJokesIds();

    if (!allJokesIds) {
      throw `Couldn't get all jokes ids. allJokesIds: ${allJokesIds}`;
    }

    const joke = await getJoke(allJokesIds);

    if (!joke) {
      throw `For some reason joke is empty`;
    }

    await Promise.all([jokesDB.saveJoke(joke), jokesDB.saveLastJoke(joke)]);

    return {
      statusCode: 200,
      body: 'OK',
    };
  } catch (error) {
    await handleError('get joke lambda handler', error);

    return {
      statusCode: 200,
      body: 'NOT OK',
    };
  }
};
