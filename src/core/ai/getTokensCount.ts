import { getEncoding } from 'js-tiktoken';
import { handleError } from '../utils/error-handler.util';

export const getTokensCount = async (text: string) => {
  try {
    const enc = getEncoding('gpt2');
    const tokens = enc.encode(text);

    return tokens.length;
  } catch (error) {
    await handleError('messageText', error);
  }
};
