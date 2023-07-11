import {
  getTheLastJoke,
  saveExplanation,
  saveExplanationRequest,
} from './database.js';
import { delay, handleError, log } from './utils.js';
import { deleteMessage, sendMessage, sendSticker } from './telegram.js';
import axios from 'axios';
import { CONSTANTS } from './constants.js';

export const explainJoke = async (message) => {
  let stickerMessage;

  try {
    log('start explaining the last joke');

    stickerMessage = await sendSticker(
      message.chat.id,
      CONSTANTS.STICKERS.LOADING_DUCK
    );

    const startStickerDisplaying = Date.now();

    const theLastJoke = await getTheLastJoke();

    if (!theLastJoke) {
      await saveExplanationRequest(
        message.chat.id,
        CONSTANTS.ERRORS.NO_LAST_JOKE
      );

      throw new Error(CONSTANTS.ERRORS.NO_LAST_JOKE);
    }

    await saveExplanationRequest(message.chat.id, theLastJoke.id);

    if (theLastJoke.joke_explanation) {
      log('explanation exists');

      await delay(Math.max(1500 - (Date.now() - startStickerDisplaying), 0));

      return await sendMessage(message.chat.id, theLastJoke.joke_explanation);
    }

    const prompt = getExplainJokePrompt(theLastJoke.joke_text);
    const explanation = await askGPT(prompt);

    if (!explanation) {
      throw new Error('No explanation');
    }

    await sendMessage(message.chat.id, explanation);

    await saveExplanation(theLastJoke.id, explanation);

    log('end explaining the joke');
  } catch (error) {
    await sendMessage(message.chat.id, CONSTANTS.MESSAGES.NO_EXPLANATION);

    handleError('explainJoke', error);
  } finally {
    await deleteMessage(message.chat.id, stickerMessage.result.message_id);
  }
};

const askGPT = async (prompt) => {
  try {
    log('asking chat gpt');

    const { data } = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: `${process.env.OPENAI_MODEL}`,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: Number(process.env.OPENAI_MAX_TOKENS),
        temperature: Number(process.env.OPENAI_TEMPERATURE),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    log('end asking chat gpt');

    return data.choices[0].message.content.trim();
  } catch (error) {
    handleError('askGPT', error);
  }
};

const getExplainJokePrompt = (joke) =>
  `You are given a text that is surrounded by triple dashes. Find a joke in this text. Explain this joke. The explanation should be maximum 7 sentences. Do not write the joke in your response. Start your response with: 'Hey kid, ' and then add your explanation. ---${joke}---`;
