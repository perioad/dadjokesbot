import axios from 'axios';
import { CONSTANTS } from './constants.js';
import { addUser, changeUserActivityStatus } from './database.js';
import { sendDefinition } from './definitions.js';
import { handleError, log } from './utils.js';

export const handleUserRequest = async request => {
	if (isBotRestarted(request.my_chat_member)) {
		log('bot restarted', request.my_chat_member);

		return;
	}
	else if (isBotStopped(request.my_chat_member)) {
		log('bot stopping', request.my_chat_member);

		await stopBot(request.my_chat_member.chat);
	} else if (isBotStarted(request.message)) {
		log('bot starting', request.message);

		await startBot(request.message.from);
	} else if (isMessage(request.message)) {
		log('new message', request.message);

		await handleDefinitionRequest(request.message);
	} else {
		log('unknow user request')

		await handleUnknownRequest(request);
	}
}

export const sendMessage = async (chat_id, text) => {
	try {
		log('sending message', chat_id, text);

		const res = await axios.post(`${CONSTANTS.TELEGRAM_API}/sendMessage`, {
			chat_id,
			text,
			parse_mode: 'HTML'
		});

		log('success sending message', res.data);
	} catch (error) {
		handleError('sendMessage', error);
	}
}

const handleUnknownRequest = async request => {
	const message = request.my_chat_member || request.message;

	await sendMessage(message.chat.id, CONSTANTS.MESSAGES.UNKNOW_REQUEST);
}

const isBotStarted = message => {
	return message && message.text === CONSTANTS.COMMANDS.START;
}

const isBotRestarted = my_chat_member => {
	if (!my_chat_member) return;

	const status = my_chat_member.new_chat_member.status;

	return status === CONSTANTS.STATUSES.MEMBER;
}

const isMessage = message => {
	return message && message.text && !message.text.includes('/');
}

const isBotStopped = my_chat_member => {
	if (!my_chat_member) return;

	const status = my_chat_member.new_chat_member.status;

	return status === CONSTANTS.STATUSES.KICKED;
}

const handleDefinitionRequest = async message => {
	const word = message.text;
	const chatId = message.chat.id;

	await sendDefinition(chatId, word);
}

const stopBot = async chat => {
	await changeUserActivityStatus(chat.id, false);
}

const startBot = async (chat) => {
	await addUser(chat);
	await sendMessage(chat.id, CONSTANTS.MESSAGES.FIRST);
	await sendMessage(chat.id, makeItalic(CONSTANTS.JOKES.FIRST));
}

export const makeItalic = text => {
	return `<i>${text}</i>`;
}

export const makeBold = text => {
	return `<b>${text}</b>`;
}

export const makeUnderline = text => {
	return `<u>${text}</u>`;
}