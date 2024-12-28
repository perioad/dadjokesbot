import { NL } from '../constants/url.constants';
import { sendMessageToAdmin } from './admin-message.util';

export const handleError = async (
  functionName: string,
  error: any,
): Promise<void> => {
  const title = `ERROR in ${functionName}: `;

  if (!error) {
    console.error(title, 'no error was received, good luck :)');

    return;
  }

  let errorAsString: string;

  if (typeof error === 'string' || typeof error === 'number') {
    errorAsString = error.toString();
  } else {
    const properties = Object.getOwnPropertyDescriptors(error);
    const serializedError: Record<string, any> = {};

    for (const key in properties) {
      serializedError[key] = error[key];
    }

    delete serializedError.stack;

    errorAsString = JSON.stringify(serializedError, null, 2);
  }

  console.error(title, errorAsString);

  await sendMessageToAdmin(`${title}${NL}${errorAsString}`);
};
