import { bot } from '../telegram.initialization';
import { sendMessageToAdmin } from '../../../../core/utils/admin-message.util';
import { handleError } from '../../../../core/utils/error-handler.util';
import { Message, OLD_EXPLAIN_BUTTON } from '../telegram.constants';
import { replyGPT, replyGrok, summarizeGPT } from '../../../../core/ai/ask-gpt';
import { usersDB } from '../../../../core/database/users-database';
import { getTokensCount } from '../../../../core/ai/getTokensCount';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const transformCurrentHistory = (
  currentHistoryRaw: string[],
): ChatCompletionMessageParam[] => {
  return currentHistoryRaw.map(m => {
    const isKid = m.startsWith('Kid:');
    const message = m.replace('Kid: ', '').replace('Dad: ', '');

    return isKid
      ? { role: 'user', content: message }
      : { role: 'assistant', content: message };
  });
};

const getCurrentHistoryByRoles = (
  currentHistory: ChatCompletionMessageParam[],
): string[] => {
  return currentHistory.map(message => {
    return message.role === 'user'
      ? 'Kid: ' + message.content
      : 'Dad: ' + message.content;
  });
};

bot.on('message:text', async ctx => {
  try {
    if (ctx.message.text.length > Number(process.env.MAX_USER_MESSAGE_LENGTH)) {
      await ctx.reply(Message.LongMessage);

      await sendMessageToAdmin(
        `${JSON.stringify(ctx.from)}\n\nTries to send super long message:\n${
          ctx.msg.text
        }`,
      );

      return;
    }

    await ctx.replyWithChatAction('typing');

    if (ctx.message.text === OLD_EXPLAIN_BUTTON) {
      await ctx.reply(Message.NewExplain, {
        reply_markup: { remove_keyboard: true },
      });

      await sendMessageToAdmin(
        `${JSON.stringify(ctx.from)}\n\nPressed old explain button`,
      );
    } else {
      const kid = await usersDB.getUser(ctx.chat.id);

      if (!kid) {
        throw new Error(
          'User is not found for ctx from: ' + JSON.stringify(ctx.from),
        );
      }

      const currentHistoryRaw = kid.currentHistory || [];
      const isOldFormat =
        currentHistoryRaw[0] !== undefined &&
        typeof currentHistoryRaw[0] === 'string';
      const currentHistory = isOldFormat
        ? transformCurrentHistory(currentHistoryRaw as string[])
        : (currentHistoryRaw as ChatCompletionMessageParam[]);
      const summary = kid.summary || '';
      const personalityTraits = kid.personalityTraits || '';

      const newUserMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: ctx.message.text,
      };
      const updatedCurrentHistory = [...currentHistory, newUserMessage];
      const { reply, totalTokens, shouldSave } = await replyGrok(
        updatedCurrentHistory,
        summary,
        personalityTraits,
      );
      const newAssistantMessage: ChatCompletionMessageParam = {
        role: 'assistant',
        content: reply,
      };
      const updatedCurrentHistoryWithAssistantMessage = [
        ...updatedCurrentHistory,
        newAssistantMessage,
      ];

      await ctx.reply(reply);

      if (shouldSave) {
        const currentHistoryByRoles = getCurrentHistoryByRoles(currentHistory);
        const newMessagesByRoles = [
          `Kid: ${ctx.message.text}`,
          `Dad: ${reply}`,
        ];
        const currentTokens = kid.currentTokens || 0;

        const maxCurrentTokens = Number(process.env.MAX_CURRENT_TOKENS);

        if (isNaN(maxCurrentTokens)) {
          throw new Error('MAX_CURRENT_TOKENS is not a number');
        }

        if (currentTokens > maxCurrentTokens) {
          const newSummary = await summarizeGPT(summary, personalityTraits, [
            ...currentHistoryByRoles,
            ...newMessagesByRoles,
          ]);

          await usersDB.saveNewSummary(
            String(ctx.chat.id),
            newSummary,
            newMessagesByRoles,
            [newUserMessage, newAssistantMessage],
            updatedCurrentHistoryWithAssistantMessage,
            isOldFormat,
          );
        } else {
          await usersDB.saveNewMessages(
            String(ctx.chat.id),
            newMessagesByRoles,
            totalTokens,
            [newUserMessage, newAssistantMessage],
            updatedCurrentHistoryWithAssistantMessage,
            isOldFormat,
          );
        }

        await sendMessageToAdmin(
          `${JSON.stringify(ctx.from)}\n\nUser:\n${
            ctx.msg.text
          }\n\nDad:\n${reply}`,
        );
      }
    }
  } catch (error) {
    await handleError('messageText', error);
  }
});
