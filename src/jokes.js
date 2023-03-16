import axios from 'axios';
import { getAllActiveUsers, getItem, saveJoke } from './database.js';
import { makeItalic, sendMessage } from './telegram.js'
import { handleError, log } from './utils.js';

export const sendJokes = async () => {
	try {
		log('sending jokes');

		const allActiveUsers = await getAllActiveUsers();
		const jokes = await getItem('jokes');
		const joke = await getJoke(jokes);

		for (const user of allActiveUsers || []) {
			await sendMessage(user.id , makeItalic(joke));
		}

		log('success sending jokes');
	} catch (error) {
		handleError('sendJokes', error);
	}
}

const getJoke = async (jokes) => {
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
		const isOldJoke = jokes?.jokeslist.has(jokeId);

		if (isOldJoke) {
			log('old joke');

			return await getJoke(jokes);
		}

		await saveJoke(jokeId);

		log('success getting joke');

		return joke;
	} catch (error) {
		handleError('getJoke', error);
	}
}
