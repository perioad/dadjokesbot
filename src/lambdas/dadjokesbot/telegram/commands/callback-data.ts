import { jokesDB } from '../../../../core/database/jokes-database';
import { usersDB } from '../../../../core/database/users-database';
import { handleError } from '../../../../core/utils/error-handler.util';
import {
  getExplainInlineButton,
  getVoteInlineButtons,
} from '../../utils/inline-buttons.util';
import { CallbackAction } from '../telegram.constants';
import { bot } from '../telegram.initialization';

bot.on('callback_query:data', async ctx => {
  try {
    const [jokeId, action, voting, explanation] =
      ctx.callbackQuery.data.split(':');
    const isVotingAvailable = !!voting;
    const isExplanationAvailable = !!explanation;

    if (!jokeId || !action) {
      throw new Error(
        `Not enough data from callback. jokeId: ${jokeId}, action: ${action}`,
      );
    }

    if (action === CallbackAction.Explain) {
      const replyMarkup = isVotingAvailable
        ? {
            reply_markup: {
              inline_keyboard: [getVoteInlineButtons(jokeId, true, false)],
            },
          }
        : undefined;

      await ctx.editMessageReplyMarkup(replyMarkup);

      const joke = await jokesDB.getJoke(jokeId);

      if (!joke) {
        throw new Error(`No joke from db with id: ${jokeId}`);
      }

      const explanation = `${joke.explanation}`;

      await ctx.reply(explanation, {
        parse_mode: 'HTML',
        reply_parameters: {
          message_id: ctx.msg?.message_id as number,
          quote: joke.joke,
        },
      });

      if (joke.explanationVoiceId) {
        await ctx.replyWithVoice(joke.explanationVoiceId);
      }

      if (ctx.chat?.id) {
        await usersDB.addExplanation(String(ctx.chat.id));
      }
    }

    if (
      action === CallbackAction.Upvote ||
      action === CallbackAction.Downvote
    ) {
      const replyMarkup = isExplanationAvailable
        ? {
            reply_markup: {
              inline_keyboard: [getExplainInlineButton(jokeId, false, true)],
            },
          }
        : undefined;

      await ctx.editMessageReplyMarkup(replyMarkup);
      await jokesDB.voteJoke(jokeId, action);
    }

    await ctx.answerCallbackQuery('✅');
  } catch (error) {
    await ctx.answerCallbackQuery('⚠️');

    await handleError('callback-data', error);
  }
});
