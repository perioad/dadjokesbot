import { User } from 'grammy/types';
import { db } from '../../database/database';
import { Message, Status } from '../telegram.constants';
import { bot } from '../telegram.initialization';
import { sendMessageToAdmin } from '../telegram.utils';

bot.command('start', async ctx => {
  const kid = await db.getKid(ctx.chat.id);

  if (kid) {
    if (kid.isActive) {
      await ctx.reply(Message.AlreadyActive);

      return;
    }

    await ctx.reply(Message.ComeBack);
    await db.reactivateKid(ctx.chat.id);
    await sendMessageToAdmin(`User back: ${JSON.stringify(ctx.from)}`);

    return;
  }

  await ctx.reply(Message.Greeting, { parse_mode: 'HTML' });
  await db.saveKid(ctx.from as User);
  await sendMessageToAdmin(`New User: ${JSON.stringify(ctx.from)}`);
});

bot.on('my_chat_member', async ctx => {
  const { status } = ctx.myChatMember.new_chat_member;

  if (status === Status.Kicked) {
    await db.deactivateKid(ctx.chat.id);
    await sendMessageToAdmin(`User left: ${JSON.stringify(ctx.from)}`);
  }
});
