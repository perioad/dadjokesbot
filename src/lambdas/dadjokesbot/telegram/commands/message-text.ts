import { bot } from '../telegram.initialization';
import { sendMessageToAdmin } from '../../../../core/utils/admin-message.util';
import { NL } from '../../../../core/constants/url.constants';
import { handleError } from '../../../../core/utils/error-handler.util';
import { Message, OLD_EXPLAIN_BUTTON } from '../telegram.constants';
import { replyGPT, summarizeGPT } from '../../../../core/ai/ask-gpt';
import { usersDB } from '../../../../core/database/users-database';
import { getTokensCount } from '../../../../core/ai/getTokensCount';

bot.on('message:text', async ctx => {
  try {
    if (ctx.message.text.length > Number(process.env.MAX_USER_MESSAGE_LENGTH)) {
      await ctx.reply(Message.LongMessage);

      await sendMessageToAdmin(
        `${JSON.stringify(
          ctx.from,
        )}${NL}${NL}Tries to send super long message:${NL}${ctx.msg.text}`,
      );

      return;
    }

    await ctx.replyWithChatAction('typing');

    if (ctx.message.text === OLD_EXPLAIN_BUTTON) {
      await ctx.reply(Message.NewExplain, {
        reply_markup: { remove_keyboard: true },
      });

      await sendMessageToAdmin(
        `${JSON.stringify(ctx.from)}${NL}${NL}Pressed old explain button`,
      );
    } else {
      const kid = await usersDB.getUser(ctx.chat.id);

      if (!kid) {
        throw new Error('User is not found');
      }

      const summary = kid.summary || '';
      const personalityTraits = kid.personalityTraits || '';
      const currentHistory = kid.currentHistory || [];
      const currentTokens = kid.currentTokens || 0;

      const { reply, completionTokens, shouldSave } = await replyGPT(
        ctx.message.text,
        summary,
        personalityTraits,
        currentHistory,
      );

      await ctx.reply(reply);

      if (shouldSave) {
        const messageTokens = (await getTokensCount(ctx.message.text)) || 0;
        const newTokens = completionTokens + messageTokens;
        const newMessages = [`Kid: ${ctx.message.text}`, `Dad: ${reply}`];
        const newCurrentTokens = newTokens + currentTokens;

        const maxCurrentTokens = Number(process.env.MAX_CURRENT_TOKENS);

        if (isNaN(maxCurrentTokens)) {
          throw new Error('MAX_CURRENT_TOKENS is not a number');
        }

        if (newCurrentTokens > maxCurrentTokens) {
          const newSummary = await summarizeGPT(summary, personalityTraits, [
            ...currentHistory,
            ...newMessages,
          ]);

          await usersDB.saveNewSummary(
            String(ctx.chat.id),
            newSummary,
            newMessages,
            newTokens,
          );
        } else {
          await usersDB.saveNewMessages(
            String(ctx.chat.id),
            newMessages,
            newTokens,
          );
        }

        await sendMessageToAdmin(
          `${JSON.stringify(ctx.from)}${NL}${NL}User:${NL}${
            ctx.msg.text
          }${NL}${NL}Dad:${NL}${reply}`,
        );
      }
    }
  } catch (error) {
    await handleError('messageText', error);
  }
});
