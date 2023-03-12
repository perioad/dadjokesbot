import * as dotenv from 'dotenv';

dotenv.config();

const { TOKEN } = process.env;
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const MESSAGES = {
	FIRST: `Hey kid 😎
Always wanted to tell you that I proud of you 🤘🏼
By the way, I have a hilarious joke for ya:`,
	NO_DEFINITIONS: "Sorry kid, I don't know how to define this word. Ask mom, alright?",
	UNKNOW_REQUEST: "Sorry kid, I'm not a superman to handle requests like this...",
	ANOTHER_START: `Don't be so silly. Our disscussion is already started 😉`,
	NEXT_JOKE: 'The next joke is going to be delivered at 14:20 UTC time 🕒'
};
const STATUSES = {
	KICKED: 'kicked',
	MEMBER: 'member'
};
const JOKES = {
	FIRST: "A guy was fired from the keyboard factory yesterday. He wasn't putting in enough shifts."
};
const COMMANDS = {
	START: '/start'
};
const MESSAGES_DELAY = 50;

const RESPONSE_STATUSES = {
	SUCCESS: {
		statusCode: 200,
		body: JSON.stringify({ status: 'success' })
	},
	ERROR: {
		statusCode: 200,
		body: JSON.stringify({ status: 'error' })
	}
};

export const CONSTANTS = {
	TOKEN,
	TELEGRAM_API,
	MESSAGES,
	STATUSES,
	JOKES,
	RESPONSE_STATUSES,
	COMMANDS,
	MESSAGES_DELAY
};
