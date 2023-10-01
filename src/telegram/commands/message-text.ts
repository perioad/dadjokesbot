import { handleError } from '../../utils/error-handler.util';
import { NL } from '../telegram.constants';
import { bot } from '../telegram.initialization';
import { getRandomReply, sendMessageToAdmin } from '../telegram.utils';

bot.on('message:text', async ctx => {
  try {
    await ctx.reply(getRandomReply());

    await sendMessageToAdmin(
      `User:${NL}${JSON.stringify(ctx.from)}${NL}Writes message:${NL}${
        ctx.msg.text
      }`,
    );
  } catch (error) {
    handleError('messageText', error);
  }
});
