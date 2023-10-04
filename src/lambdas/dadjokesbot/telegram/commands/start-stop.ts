import { User } from 'grammy/types';
import { Message, Status } from '../telegram.constants';
import { bot } from '../telegram.initialization';
import { sendMessageToAdmin } from '../../../../core/utils/admin-message.util';
import { handleError } from '../../../../core/utils/error-handler.util';
import { usersDB } from '../../../../core/database/users-database';

bot.command('start', async ctx => {
  try {
    const kid = await usersDB.getKid(ctx.chat.id);

    if (kid) {
      if (kid.isActive) {
        await ctx.reply(Message.AlreadyActive);

        return;
      }

      await ctx.reply(Message.ComeBack);
      await usersDB.reactivateKid(ctx.chat.id);

      await sendMessageToAdmin(`User back: ${JSON.stringify(ctx.from)}`);

      return;
    }

    await ctx.reply(Message.Greeting, { parse_mode: 'HTML' });
    await usersDB.saveKid(ctx.from as User);

    await sendMessageToAdmin(`New User: ${JSON.stringify(ctx.from)}`);
  } catch (error) {
    await handleError('startCommand', error);
  }
});

bot.on('my_chat_member', async ctx => {
  try {
    const { status } = ctx.myChatMember.new_chat_member;

    if (status === Status.Kicked) {
      await usersDB.deactivateKid(ctx.chat.id);

      await sendMessageToAdmin(`User left: ${JSON.stringify(ctx.from)}`);
    }
  } catch (error) {
    await handleError('myChatMemberCommand', error);
  }
});
