import axios from 'axios';
import { CONSTANTS } from './constants.js';
import { getAllActiveUsers, getItem, saveJoke } from './database.js';
import { makeItalic, sendMessage } from './telegram.js'
import { delay, handleError, log } from './utils.js';

export const sendJokes = async () => {
	try {
		log('sending jokes');

		const allActiveUsers = await getAllActiveUsers();
		const jokes = await getItem('jokes');
		const joke = await getJoke(jokes);

		const startSending = Date.now();
		// for (const user of allActiveUsers || []) {
		for (const number of Array(1)) {
			const start = Date.now();

			sendMessage(129164429, makeItalic(CONSTANTS.JOKES.FIRST));
			// await sendMessage(user.id, makeItalic(joke));

			log('after sending message', Date.now() - start);
		}

		log('overall time sending', Date.now() - startSending)

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
