import { jokesDB } from '../../../../core/database/jokes-database';
import { handleError } from '../../../../core/utils/error-handler.util';
import { Message } from '../telegram.constants';
import { bot } from '../telegram.initialization';

bot.on('callback_query:data', async ctx => {
  try {
    const [jokeId] = ctx.callbackQuery.data.split(':');

    if (!jokeId) {
      throw `No joke id from callback data`;
    }

    const joke = await jokesDB.getJoke(jokeId);

    if (!joke) {
      throw `No joke from db with id: ${jokeId}`;
    }

    const explanation = `<i>${joke.joke}</i>\n\n${joke.explanation}`;

    await ctx.answerCallbackQuery('🚀');
    await ctx.reply(explanation, { parse_mode: 'HTML' });
    await ctx.editMessageReplyMarkup();
  } catch (error) {
    await ctx.answerCallbackQuery('⚠️');
    await ctx.reply(Message.SomethingWentWrong);

    await handleError('callback-data', error);
  }
});
