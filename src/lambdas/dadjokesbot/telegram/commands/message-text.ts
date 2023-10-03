import { bot } from '../telegram.initialization';
import { sendMessageToAdmin } from '../../../../core/utils/admin-message.util';
import { getRandomReply } from '../../utils/random-reply.util';
import { NL } from '../../../../core/constants/url.constants';
import { handleError } from '../../../../core/utils/error-handler.util';

bot.on('message:text', async ctx => {
  try {
    await ctx.reply(getRandomReply());

    await sendMessageToAdmin(
      `User:${NL}${JSON.stringify(ctx.from)}${NL}Writes message:${NL}${
        ctx.msg.text
      }`,
    );
  } catch (error) {
    await handleError('messageText', error);
  }
});
