import { log } from '../../core/utils/logger.util';
import { handleError } from '../../core/utils/error-handler.util';
import { getJoke } from './get-joke';
import { jokesDB } from '../../core/database/jokes-database';
import { explainJoke } from './explain-joke';
import { voiceText } from '../../core/ai/voice';

export const handler = async () => {
  try {
    log('get joke lambda');

    const joke = await getJoke();

    if (!joke) {
      throw new Error(`For some reason joke is empty`);
    }

    const explanation = await explainJoke(joke.joke);

    if (!explanation) {
      throw new Error(`No joke explanation`);
    }

    const jokeVoiceId = await voiceText(joke.joke);
    const explanationVoiceId = await voiceText(explanation);

    await Promise.all([
      jokesDB.saveJoke(joke, explanation, jokeVoiceId, explanationVoiceId),
      jokesDB.saveLastJoke(joke, jokeVoiceId),
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
