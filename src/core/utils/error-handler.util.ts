import { NL } from '../constants/url.constants';
import { sendMessageToAdmin } from './admin-message.util';

export const handleError = async (
  functionName: string,
  error: any,
): Promise<void> => {
  const title = `ERROR in ${functionName}: `;

  if (!error) {
    console.error(title, 'good luck :)');
  } else {
    console.error(title, JSON.stringify(error));
  }

  await sendMessageToAdmin(`${title}${NL}${JSON.stringify(error)}`);
};
