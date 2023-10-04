import { handleError } from '../../core/utils/error-handler.util';
import { log } from '../../core/utils/logger.util';
import { Joke } from './models/joke.interface';

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

    log('success getting joke', joke);

    return joke;
  } catch (error) {
    await handleError('getJoke', error);
  }
};
