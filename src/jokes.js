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
			await sendMessage(user.id, `Hey there kid, sorry for bothering you but dad here with some exciting news for you! 🥳

From now on, I can provide you with the explanations to my hilarious jokes. No more scratching your head and wondering why you didn't get the joke. Now, you can have the satisfaction of knowing exactly why my jokes are so pun-tastic! 😅

So next time you get one of my jokes, just press the button <b>Explain this joke, dad</b> or write in chat <i>Explain this joke, dad</i> and I'll be happy to provide it. And remember, laughter is the best medicine, even if the joke is a bit cheesy!

And you could check it right now with a brand new joke!

Love,
Dad (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧`, CONSTANTS.BUTTONS.EXPLAIN);
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
