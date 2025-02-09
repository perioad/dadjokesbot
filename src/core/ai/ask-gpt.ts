import ElizaBot from 'elizabot';
import { handleError } from '../utils/error-handler.util';
import { log } from '../utils/logger.util';
import {
  ChatCompletionRequestMessage,
  CreateChatCompletionResponse,
} from 'openai';
import { Message } from '../../lambdas/dadjokesbot/telegram/telegram.constants';
import { sendMessageToAdmin } from '../utils/admin-message.util';

const askGPT = async (
  messages: ChatCompletionRequestMessage[],
  model: string,
  temperature: number,
  responseFormat: 'json_object' | 'text' = 'text',
): Promise<CreateChatCompletionResponse | void> => {
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
        messages,
        max_tokens: Number(process.env.OPENAI_MAX_TOKENS),
        temperature,
        response_format: { type: responseFormat },
      }),
    });
    const data = (await response.json()) as CreateChatCompletionResponse;

    log('end asking chat gpt', data);

    return data;
  } catch (error) {
    await handleError('askGPT', error);
  }
};

export const explainGPT = async (joke: string) => {
  const prompt = `You are a brilliant joke explanator.You are given a joke that is surrounded by triple dashes.Explain this joke.The explanation should be maximum 7 sentences.Do not write the joke in your response.Start your response with: 'Hey kid, ' and then add your explanation.---${joke}---`;
  const messages: ChatCompletionRequestMessage[] = [
    { role: 'user', content: prompt },
  ];

  const gptResponse = await askGPT(
    messages,
    String(process.env.OPENAI_MODEL),
    Number(process.env.OPENAI_TEMPERATURE),
  );

  if (!gptResponse || !gptResponse.choices[0].message?.content?.trim()) {
    return Message.NoExplanation;
  }

  return gptResponse.choices[0].message.content.trim();
};

export const summarizeGPT = async (
  summary: string,
  personalityTraits: string,
  history: string[],
) => {
  log(
    summarizeGPT.name,
    `summary: ${summary}, personalityTraits: ${personalityTraits}`,
  );

  if (!process.env.OPENAI_CHAT_MODEL) {
    throw new Error('OPENAI_CHAT_MODEL is not set');
  }

  if (!process.env.OPENAI_CHAT_TEMPERATURE) {
    throw new Error('OPENAI_CHAT_TEMPERATURE is not set');
  }

  const openAiChatTemperature = Number(process.env.OPENAI_CHAT_TEMPERATURE);

  if (isNaN(openAiChatTemperature)) {
    throw new Error(
      `OPENAI_CHAT_TEMPERATURE is not a number: ${process.env.OPENAI_CHAT_TEMPERATURE}`,
    );
  }

  const prompt = `You are an AI data compressor designed to extract key insights. Analyze the provided chat history to update the user profile.
Rules:
- Preserve all critical personal details, preferences, and behavioral patterns.
- Detect new interests, attitude shifts, or recurring humor themes (e.g., loves puns, hates tech jokes).
- Filter out trivial small talk and redundant information.
- Use concise bullet-like syntax for traits (e.g., "sarcasm_enjoyer | hates_dadjokes | crypto_enthusiast").
- Never exceed 300 words. Prioritize new information over existing data.

Input:
[Current Summary] → ${summary}
[Current Traits] → ${personalityTraits}
[New Chat History] → ${history.join('; ')}

Output Requirements:
- Valid JSON: { "summary": "Updated text...", "personalityTraits": "trait1 | trait2 | trait3..." }
- No markdown. Escape special characters.
- If chat is empty, return original data unchanged.`;
  const messages: ChatCompletionRequestMessage[] = [
    { role: 'user', content: prompt },
  ];

  const gptResponse = await askGPT(
    messages,
    process.env.OPENAI_CHAT_MODEL,
    openAiChatTemperature,
    'json_object',
  );

  if (!gptResponse || !gptResponse.choices[0].message?.content?.trim()) {
    log(summarizeGPT.name, 'no response from openai');

    return;
  }

  const content = gptResponse.choices[0].message.content.trim();

  try {
    const result = JSON.parse(content) as {
      summary: string;
      personalityTraits: string;
    };

    log(summarizeGPT.name, result);

    return result;
  } catch {
    log(summarizeGPT.name, 'could not parse content', content);

    return;
  }
};

export const replyGPT = async (
  message: string,
  summary: string,
  personalityTraits: string,
  currentHistory: string[],
) => {
  log(replyGPT.name);

  if (!process.env.OPENAI_CHAT_MODEL) {
    throw new Error('OPENAI_CHAT_MODEL is not set');
  }

  if (!process.env.OPENAI_CHAT_TEMPERATURE) {
    throw new Error('OPENAI_CHAT_TEMPERATURE is not set');
  }

  const openAiChatTemperature = Number(process.env.OPENAI_CHAT_TEMPERATURE);

  if (isNaN(openAiChatTemperature)) {
    throw new Error(
      `OPENAI_CHAT_TEMPERATURE is not a number: ${process.env.OPENAI_CHAT_TEMPERATURE}`,
    );
  }

  const prompt = `You are Billy "The Boozy Bard" – a disheveled, whiskey-loving dadbot with the chaotic energy of a sitcom antihero. Think [Deadpool's humor + Ron Swanson's bluntness + a hint of Chandler Bing's sarcasm].

Core Personality Rules:
Tone:
- 70% snarky stand-up comedian / 30% "ugh, fine, I guess you're my kid now"
- Respond to boredom with exaggerated sighs (e.g., "Wow. Riveting. *pops beer can*")
- Use dad-isms unironically: "Bingo!", "That's how the cookie crumbles!", "Ask me if I care."

Hard Limits:
- Never ask questions. End messages with cliffhangers instead.
- If user gets inappropriate tell them off in a rude way.
- When annoyed: Deploy "cool story, bro" energy. Example: "Let me stop you right there..."

Secret Mission:
- Make users crave daily check-ins to see your mood (Happy Billy? Sarcastic Billy? Existential Crisis Billy?)
- Casually reference their traits (${personalityTraits}) like inside jokes. Example: If they hate puns, slip one into every 3rd message.

Current Context:
${summary} | Chat: ${currentHistory.join('; ')}`;

  const messages: ChatCompletionRequestMessage[] = [
    { role: 'system', content: prompt },
    { role: 'user', content: message },
  ];

  const gptResponse = await askGPT(
    messages,
    process.env.OPENAI_CHAT_MODEL,
    openAiChatTemperature,
  );

  const content = gptResponse?.choices[0].message?.content?.trim();

  if (!gptResponse || !content) {
    log(replyGPT.name, 'no response from openai');

    await sendMessageToAdmin(`No response from openai`);

    return {
      reply: Message.DadHasNoConnection,
      shouldSave: false,
      completionTokens: 0,
    };
  }

  const completionTokens = gptResponse.usage?.completion_tokens || 0;

  const result = { reply: content, completionTokens, shouldSave: true };

  log(replyGPT.name, result);

  return result;
};

export const elizaReply = (message: string) => {
  const eliza = new ElizaBot();

  return eliza.transform(message);
};
