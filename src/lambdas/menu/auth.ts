import * as crypto from 'crypto';

export const checkIfAuthenticated = (initData: string): boolean => {
  if (!initData) {
    return false;
  }

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get('hash');

  urlParams.delete('hash');
  urlParams.sort();

  let dataCheckString = '';

  for (const [key, value] of urlParams.entries()) {
    dataCheckString += `${key}=${value}\n`;
  }

  dataCheckString = dataCheckString.slice(0, -1);

  const secret = crypto
    .createHmac('sha256', 'WebAppData')
    .update(process.env.BOT_TOKEN as string)
    .digest();
  const calculatedHash = crypto
    .createHmac('sha256', secret)
    .update(dataCheckString)
    .digest('hex');

  return calculatedHash === hash;
};
