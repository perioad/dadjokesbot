import axios from 'axios';
import { getAllActiveUsers, getAllItemsFromTable, saveJoke } from './database.js';
import { makeItalic, sendMessage } from './telegram.js'
import { handleError, log } from './utils.js';
import { CONSTANTS } from './constants.js';

export const sendJokes = async () => {
	try {
		log('sending jokes');

		const allActiveUsers = await getAllActiveUsers();
		const jokesIds = await getAllItemsFromTable('dadjokeslist', 'id');
		const joke = await getJoke(jokesIds);

		for (const user of allActiveUsers || []) {
			await sendMessage(user.id, makeItalic(joke), CONSTANTS.BUTTONS.EXPLAIN);
		}

		log('success sending jokes');
	} catch (error) {
		handleError('sendJokes', error);
	}
}

const getJoke = async (jokesIds) => {
	try {
		log('getting joke');

		const jokeRaw = await axios.get('https://icanhazdadjoke.com', {
			headers: {
				'User-Agent': 'Telegram bot (@jokes_by_dad_bot). Contacts: @perioad',
				Accept: 'application/json'
			}
		});
		const jokeId = jokeRaw.data.id;
		const joke = jokeRaw.data.joke;
		const isOldJoke = jokesIds?.find(id => id === jokeId);

		if (isOldJoke) {
			log('old joke');

			return await getJoke(jokesIds);
		}

		await saveJoke(jokeId, joke);

		log('success getting joke');

		return joke;
	} catch (error) {
		handleError('getJoke', error);
	}
}
