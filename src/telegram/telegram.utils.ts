import { random } from 'lodash-es';
import { LISTENING_MESSAGES } from './telegram.constants';

export const sendMessageToAdmin = async (message: string) => {
  await fetch(
    `https://api.telegram.org/bot${process.env.ADMIN_TOKEN}/sendMessage?chat_id=${process.env.ADMIN_CHAT_ID}&text=${message}`,
  );
};

export const getRandomReply = () => {
  const maxIndex = LISTENING_MESSAGES.length - 1;

  return LISTENING_MESSAGES[random(0, maxIndex)];
};
