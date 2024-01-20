import { bot } from '../telegram.initialization';
import { sendMessageToAdmin } from '../../../../core/utils/admin-message.util';
import { NL } from '../../../../core/constants/url.constants';
import { handleError } from '../../../../core/utils/error-handler.util';
import { Message, OLD_EXPLAIN_BUTTON } from '../telegram.constants';
import { elizaReply } from '../../../../core/ai/ask-gpt';

bot.on('message:text', async ctx => {
  try {
    const message =
      ctx.message.text === OLD_EXPLAIN_BUTTON
        ? Message.NewExplain
        : elizaReply(ctx.message.text);

    await ctx.reply(message, {
      reply_markup: { remove_keyboard: true },
    });

    await sendMessageToAdmin(
      `User:${NL}${JSON.stringify(ctx.from)}${NL}Writes message:${NL}${
        ctx.msg.text
      }`,
    );
  } catch (error) {
    await handleError('messageText', error);
  }
});
