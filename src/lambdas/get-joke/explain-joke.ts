import { explainGPT } from '../../core/ai/ask-gpt';
import { handleError } from '../../core/utils/error-handler.util';
import { log } from '../../core/utils/logger.util';

export const explainJoke = async (joke: string): Promise<string | void> => {
  try {
    log('explaining joke');

    const explanation = await explainGPT(joke);

    return explanation;
  } catch (error) {
    await handleError('explainJoke', error);
  }
};
