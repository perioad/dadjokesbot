import { getTheLastJoke, saveExplanation, saveExplanationRequest } from './database.js';
import { handleError, log } from './utils.js';
import { sendMessage } from './telegram.js';
import axios from 'axios';
import { CONSTANTS } from './constants.js';

export const explainJoke = async (message) => {
	try {
		log('start explaining the last joke');

		const theLastJoke = await getTheLastJoke();

		if (!theLastJoke) {
			await saveExplanationRequest(message.chat.id, CONSTANTS.ERRORS.NO_LAST_JOKE);

			throw new Error(CONSTANTS.ERRORS.NO_LAST_JOKE);
		}

		await saveExplanationRequest(message.chat.id, theLastJoke.id);

		if (theLastJoke.joke_explanation) {
			log('explanation exists');

			return await sendMessage(message.chat.id, theLastJoke.joke_explanation);
		}

		const prompt = getExplainJokePrompt(theLastJoke.joke_text);
		const explanation = await askGPT(prompt);

		if (!explanation) {
			throw new Error('No explanation');
		}

		await sendMessage(message.chat.id, explanation.text);

		await saveExplanation(theLastJoke.id, explanation.text);

		log('end explaining the joke');
	} catch (error) {
		await sendMessage(message.chat.id, CONSTANTS.MESSAGES.NO_EXPLANATION);

		handleError('explainJoke', error);
	}
}

const askGPT = async (prompt) => {
	try {
		log('asking chat gpt');

		const { data } = await axios.post('https://api.openai.com/v1/completions',
			{
				model: 'text-davinci-003',
				prompt,
				max_tokens: 256,
				temperature: 0.7
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
				}
			});

		log('end asking chat gpt');

		return data.choices[0];
	} catch (error) {
		handleError('askGPT', error);
	}
}

const getExplainJokePrompt = joke => `You are given a text that is surrounded by triple dashes. Find a joke in this text. Explain this joke in as much detail as possible. Start your response with: 'Hey kid, '. ---${joke}---`;