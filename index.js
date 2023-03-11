import { CONSTANTS } from './src/constants.js';

import { log, handleError } from './src/utils.js';
import { handleUserRequest } from './src/telegram.js';
import { sendJokes } from './src/jokes.js';

export const handler = async (event) => {
	log('event: ', event);

	// if (event.source === 'aws.events') {
	if (event.rawPath === '/') {
		log('scheduled event');

		await sendJokes();

		return CONSTANTS.RESPONSE_STATUSES.SUCCESS;
	}

	const body = JSON.parse(event.body);

	log('new event from tg', body);

	try {
		await handleUserRequest(body);

		return CONSTANTS.RESPONSE_STATUSES.SUCCESS;
	} catch (error) {
		handleError('event from tg', error);

		return CONSTANTS.RESPONSE_STATUSES.ERROR;
	}
};
