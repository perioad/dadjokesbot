import { log } from '../../core/utils/logger.util';
import { handleError } from '../../core/utils/error-handler.util';
import { getJoke } from './get-joke';
import { jokesDB } from '../../core/database/jokes-database';
import { explainJoke } from './explain-joke';

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

    const explanation = await explainJoke(joke.joke);

    if (!explanation) {
      throw `No joke explanation`;
    }

    await Promise.all([
      jokesDB.saveJoke(joke, explanation),
      jokesDB.saveLastJoke(joke),
    ]);

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
