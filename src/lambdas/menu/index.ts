import { log } from '../../core/utils/logger.util';
import { handleError } from '../../core/utils/error-handler.util';
import { checkIfAuthenticated } from './auth';
import { sendMessageToAdmin } from '../../core/utils/admin-message.util';
import { NL } from '../../core/constants/url.constants';

export const handler = async (event: any) => {
  try {
    log('menu lambda event:', JSON.stringify(event));

    const body = JSON.parse(event.body);
    const isAuthenticated = checkIfAuthenticated(body.initData);

    if (!isAuthenticated) {
      log('Not authenticated request');

      await sendMessageToAdmin(
        'Someone is performing not authenticated request in the menu',
      );

      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ok: false }),
      };
    }

    const urlParams = new URLSearchParams(body.initData);
    const userRaw = urlParams.get('user');

    if (body.action === 'feedback') {
      await sendMessageToAdmin(
        `Dadjokes feedback:${NL}${body.feedback}${NL}From user:${NL}${userRaw}`,
      );
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ok: true }),
    };
  } catch (error) {
    await handleError('menu lambda handler', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ok: false }),
    };
  }
};
