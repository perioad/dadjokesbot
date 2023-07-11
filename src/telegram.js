import axios from 'axios';
import { CONSTANTS } from './constants.js';
import {
  addUser,
  changeUserActivityStatus,
  getTheLastJoke,
} from './database.js';
import { sendDefinition } from './definitions.js';
import { handleError, log } from './utils.js';
import { explainJoke } from './gpt.js';
import { sendListeningMessage } from './chat.js';
import { handleFeedback } from './feedback.js';

export const handleUserRequest = async (request) => {
  if (isBotRestarted(request.my_chat_member)) {
    log('bot restarted', request.my_chat_member);

    return;
  } else if (isBotStopped(request.my_chat_member)) {
    log('bot stopping', request.my_chat_member);

    await stopBot(request.my_chat_member.chat);
  } else if (isBotStarted(request.message)) {
    log('bot starting', request.message);

    await startBot(request.message.from);
  } else if (isFeedback(request.message)) {
    log('giving feedback', request.message);

    await handleFeedback(request.message);
  } else if (isExplainJoke(request.message)) {
    log('request to explain a joke', request.message);

    await explainJoke(request.message);
  } else if (isMessage(request.message)) {
    log('new message', request.message);

    await sendListeningMessage(request.message.chat.id);
  } else {
    log('unknow user request');

    await handleUnknownRequest(request);
  }
};

export const sendMessage = async (chat_id, text, button) => {
  try {
    log('sending message');

    let reply_markup = null;

    if (button) {
      reply_markup = {
        keyboard: [[button]],
        is_persistent: true,
        resize_keyboard: true,
        one_time_keyboard: true,
      };
    }

    const payload = {
      chat_id,
      text,
      parse_mode: 'HTML',
    };

    if (reply_markup) {
      payload.reply_markup = reply_markup;
    }

    await axios.post(`${CONSTANTS.TELEGRAM_API}/sendMessage`, payload);

    log('success sending message');
  } catch (error) {
    handleError('sendMessage', error);
  }
};

export const sendSticker = async (chat_id, sticker) => {
  try {
    log('sending sticker');

    const payload = {
      chat_id,
      sticker,
    };

    const { data } = await axios.post(
      `${CONSTANTS.TELEGRAM_API}/sendSticker`,
      payload
    );

    log('success sending sticker');

    return data;
  } catch (error) {
    handleError('sendSticker', error);
  }
};

export const deleteMessage = async (chat_id, message_id) => {
  try {
    log('deleting message');

    const payload = {
      chat_id,
      message_id,
    };

    await axios.post(`${CONSTANTS.TELEGRAM_API}/deleteMessage`, payload);

    log('success deleting message');
  } catch (error) {
    handleError('deleteMessage', error);
  }
};

const handleUnknownRequest = async (request) => {
  const message = request.my_chat_member || request.message;

  await sendMessage(message.chat.id, CONSTANTS.MESSAGES.UNKNOW_REQUEST);
};

const isBotStarted = (message) => {
  return message && message.text === CONSTANTS.COMMANDS.START;
};

const isExplainJoke = (message) => {
  return message && message.text === CONSTANTS.BUTTONS.EXPLAIN;
};

const isFeedback = (message) => {
  return message && message.text.startsWith(CONSTANTS.COMMANDS.FEEDBACK);
};

const isBotRestarted = (my_chat_member) => {
  if (!my_chat_member) return;

  const status = my_chat_member.new_chat_member.status;

  return status === CONSTANTS.STATUSES.MEMBER;
};

const isMessage = (message) => {
  return message && message.text && !message.text.includes('/');
};

const isBotStopped = (my_chat_member) => {
  if (!my_chat_member) return;

  const status = my_chat_member.new_chat_member.status;

  return status === CONSTANTS.STATUSES.KICKED;
};

const handleDefinitionRequest = async (message) => {
  const word = message.text;
  const chatId = message.chat.id;

  await sendDefinition(chatId, word);
};

const stopBot = async (chat) => {
  await changeUserActivityStatus(chat.id, false);
};

const startBot = async (chat) => {
  const existingActiveUser = await addUser(chat);

  if (existingActiveUser) {
    await sendMessage(existingActiveUser.id, CONSTANTS.MESSAGES.ANOTHER_START);
  } else {
    const theLastJoke = await getTheLastJoke();

    if (!theLastJoke) {
      throw new Error('No last joke');
    }

    const firstJoke = theLastJoke
      ? `${CONSTANTS.MESSAGES.BTW}\n\n${makeItalic(theLastJoke.joke_text)}`
      : '';

    await sendMessage(
      chat.id,
      `${CONSTANTS.MESSAGES.FIRST}\n\n${firstJoke + '\n\n'}${
        CONSTANTS.MESSAGES.NEXT_JOKE
      }`,
      CONSTANTS.BUTTONS.EXPLAIN
    );
  }
};

export const makeItalic = (text) => {
  return `<i>${text}</i>`;
};

export const makeBold = (text) => {
  return `<b>${text}</b>`;
};

export const makeUnderline = (text) => {
  return `<u>${text}</u>`;
};
