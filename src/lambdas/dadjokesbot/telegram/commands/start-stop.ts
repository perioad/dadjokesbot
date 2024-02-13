import { User } from 'grammy/types';
import { InitialJoke, Message, Status } from '../telegram.constants';
import { bot } from '../telegram.initialization';
import { sendMessageToAdmin } from '../../../../core/utils/admin-message.util';
import { handleError } from '../../../../core/utils/error-handler.util';
import { usersDB } from '../../../../core/database/users-database';
import {
  getExplainInlineButton,
  getVoteInlineButtons,
} from '../../utils/inline-buttons.util';

bot.command('start', async ctx => {
  try {
    const kid = await usersDB.getUser(ctx.chat.id);

    if (kid) {
      if (kid.isActive) {
        await ctx.reply(Message.AlreadyActive);

        return;
      }

      await ctx.reply(Message.ComeBack);
      await ctx.reply(InitialJoke.joke, {
        reply_markup: {
          inline_keyboard: [
            getVoteInlineButtons(InitialJoke.id, true, true),
            getExplainInlineButton(InitialJoke.id, true, true),
          ],
        },
      });
      await usersDB.reactivateUser(ctx.chat.id);

      await sendMessageToAdmin(`User back: ${JSON.stringify(ctx.from)}`);

      return;
    }

    await ctx.reply(Message.Greeting, { parse_mode: 'HTML' });
    await ctx.reply(InitialJoke.joke, {
      reply_markup: {
        inline_keyboard: [
          getVoteInlineButtons(InitialJoke.id, true, true),
          getExplainInlineButton(InitialJoke.id, true, true),
        ],
      },
    });
    await usersDB.saveUser(ctx.from as User);

    await sendMessageToAdmin(`New User: ${JSON.stringify(ctx.from)}`);
  } catch (error) {
    await handleError('startCommand', error);
  }
});

bot.on('my_chat_member', async ctx => {
  try {
    const { status } = ctx.myChatMember.new_chat_member;

    if (status === Status.Kicked) {
      await usersDB.deactivateUser(ctx.chat.id);

      await sendMessageToAdmin(`User left: ${JSON.stringify(ctx.from)}`);

      return;
    }
  } catch (error) {
    await handleError('myChatMemberCommand', error);
  }
});
