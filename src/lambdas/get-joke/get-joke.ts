import { jokesDB } from '../../core/database/jokes-database';
import { handleError } from '../../core/utils/error-handler.util';
import { log } from '../../core/utils/logger.util';
import { Joke } from './models/joke.interface';

const MAX_REQUESTS_COUNT = 100;

let requestsCount = 1;

export const getJoke = async (): Promise<Joke | undefined> => {
  try {
    log('getting joke, requests count', requestsCount);

    if (requestsCount === MAX_REQUESTS_COUNT) {
      throw new Error(`getJoke: max number requests reached`);
    }

    const response = await fetch('https://icanhazdadjoke.com', {
      headers: {
        'User-Agent': 'Telegram bot (@jokes_by_dad_bot). Contacts: @perioad',
        Accept: 'application/json',
      },
    });
    const joke = (await response.json()) as Joke;
    const isOldJoke = await jokesDB.getJoke(joke.id);

    requestsCount += 1;

    if (isOldJoke) {
      log('old joke');

      return await getJoke();
    }

    log('success getting joke', joke);

    return joke;
  } catch (error) {
    await handleError('getJoke', error);
  }
};
