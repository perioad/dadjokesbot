import * as dotenv from 'dotenv';

dotenv.config();

const { TOKEN } = process.env;

const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;

const COMMANDS = {
  START: '/start',
  FEEDBACK: '/feedback',
};

const MESSAGES = {
  FIRST: `Hey kid 😎
Always wanted to tell you that I'm proud of you 🤘🏼`,
  NO_DEFINITIONS: `Sorry kid, I don't know how to define this word. Ask mom, alright?`,
  UNKNOW_REQUEST: `Sorry kid, I'm not a superman to handle requests like this...`,
  ANOTHER_START: `Don't be so silly. Our disscussion is already started 😉`,
  NEXT_JOKE: 'The next joke is going to be delivered at 14:20 UTC time 🕒',
  NO_EXPLANATION: `Even I don't understand this joke, ask ChatGPT, it's smarted than I...`,
  BTW: 'By the way, I have a hilarious joke for ya:',
  NO_FEEDBACK: `Hey kid, I'm glad that you want to leave a feedback! But you need to follow the next format:\n\n${COMMANDS.FEEDBACK} <i>And here your feedback right after the command</i>\n😉`,
  THANKS_FEEDBACK: `Hey kiddo, just wanted to say thanks for your feedback - it means a lot to me! 😊`,
};

const STATUSES = {
  KICKED: 'kicked',
  MEMBER: 'member',
};

const JOKES = {
  FIRST: `A guy was fired from the keyboard factory yesterday. He wasn't putting in enough shifts.`,
};

const MESSAGES_DELAY = 50;

const RESPONSE_STATUSES = {
  SUCCESS: {
    statusCode: 200,
    body: JSON.stringify({ status: 'success' }),
  },
  ERROR: {
    statusCode: 200,
    body: JSON.stringify({ status: 'error' }),
  },
};

const BUTTONS = {
  EXPLAIN: 'Explain this joke, dad',
};

const ERRORS = {
  NO_LAST_JOKE: 'No last joke',
};

const LISTENING_MESSAGES = [
  'Tell me more about it 😊',
  "I'm all ears, kiddo 👂",
  "I'm right here, ready to listen 🤗",
  'You have my full attention 👀',
  "I'm curious to hear your thoughts 🤔",
  "I'm really enjoying our conversation 😄",
  "I'm interested in what you're saying 🤩",
  "You've got my undivided attention 🎧",
  "I'm here to listen, my dear ❤️",
  'Your words matter to me 🗣️',
  "I'm focused on understanding you 🧐",
  "I'm here, listening with an open heart 💓",
  "Please go ahead, I'm listening 🙌",
  'Your voice is important to me 🌟',
  "I'm grateful to hear your perspective 🙏",
  'I appreciate you sharing that with me 🤝',
  'Your words are valuable to our conversation 💬',
  "You're doing a great job expressing yourself 👍",
  "Let's dive deeper into what you're saying 🏊",
  "I'm fully present in this conversation ✨",
  "I'm ready to learn from what you have to say 📚",
  "I'm here to support you, my love 💖",
  'You have my complete focus, sweetheart 😍',
  "I'm really interested in understanding you better 🤓",
  "I'm here as your sounding board, my little one 🎵",
  'Your ideas and thoughts are important to me 💡',
  "I'm completely engaged in our conversation 🤝",
  "You're an excellent communicator, keep going! 💪",
  "I'm here to listen without judgment 🤐",
  'I value your opinions and experiences 🌈',
  "I'm here to help, so please share with me 🤝",
  "I'm listening with an open mind and heart 🌼",
];

export const CONSTANTS = {
  TOKEN,
  TELEGRAM_API,
  MESSAGES,
  STATUSES,
  JOKES,
  RESPONSE_STATUSES,
  COMMANDS,
  MESSAGES_DELAY,
  BUTTONS,
  ERRORS,
  LISTENING_MESSAGES,
};
