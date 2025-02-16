import { sendMessageToAdmin } from './admin-message.util';
import { log } from './logger.util';

export const handleError = async (
  functionName: string,
  error: any,
): Promise<void> => {
  log('handleError', `ERROR in ${functionName}: `, 'error', error);

  const title = `ERROR in ${functionName}: `;

  if (!error) {
    console.error(title, 'no error was received, good luck :)');

    return;
  }

  let errorAsString: string;

  if (typeof error === 'string' || typeof error === 'number') {
    errorAsString = error.toString();
  } else {
    errorAsString = `Error message: ${error?.message}\nError status: ${error?.status}`;
  }

  console.error(title, errorAsString);

  await sendMessageToAdmin(`${title}\n${errorAsString}`);
};
