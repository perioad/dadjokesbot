import { handleError } from '../utils/error-handler.util';
import { log } from '../utils/logger.util';

export const askGPT = async (prompt: string): Promise<string | void> => {
  try {
    log('asking chat gpt');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: `${process.env.OPENAI_MODEL}`,
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
