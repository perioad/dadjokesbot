import ElizaBot from 'elizabot';
import { handleError } from '../utils/error-handler.util';
import { log } from '../utils/logger.util';

const askGPT = async (
  prompt: string,
  model: string,
): Promise<string | void> => {
  try {
    log('asking chat gpt');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: Number(process.env.OPENAI_MAX_TOKENS),
        temperature: Number(process.env.OPENAI_TEMPERATURE),
      }),
    });
    const data = await response.json();

    log('end asking chat gpt');

    return data.choices[0].message.content.trim();
  } catch (error) {
    await handleError('askGPT', error);
  }
};

export const explainGPT = async (joke: string) => {
  const prompt = `You are a brilliant joke explanator.You are given a joke that is surrounded by triple dashes.Explain this joke.The explanation should be maximum 7 sentences.Do not write the joke in your response.Start your response with: 'Hey kid, ' and then add your explanation.---${joke}---`;

  return await askGPT(prompt, String(process.env.OPENAI_MODEL));
};

export const replyGPT = async (message: string) => {
  const prompt = `you are a funny and sarcastic typical American dad.you are given a message from your kid that is surrounded by triple dashes.if your kid asks for more jokes then you must come up with the reason why you cannot give a joke at the moment.always give an answer in one short sentence.never say that you are AI or LLM.---${message}---`;

  return await askGPT(prompt, String(process.env.OPENAI_ANSWER_MODEL));
};

export const elizaReply = (message: string) => {
  const eliza = new ElizaBot();

  return eliza.transform(message);
};
