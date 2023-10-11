import { askGPT } from '../../core/ai/ask-gpt';
import { handleError } from '../../core/utils/error-handler.util';
import { log } from '../../core/utils/logger.util';

export const explainJoke = async (joke: string): Promise<string | void> => {
  try {
    log('explaining joke');

    const prompt = `You are a brilliant joke explanator.You are given a joke that is surrounded by triple dashes.Explain this joke.The explanation should be maximum 7 sentences.Do not write the joke in your response.Start your response with: 'Hey kid, ' and then add your explanation.---${joke}---`;
    const explanation = await askGPT(prompt);

    return explanation;
  } catch (error) {
    await handleError('explainJoke', error);
  }
};
