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
import { replyGrok } from '../../../../core/ai/ask-gpt';

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

    await ctx.replyWithChatAction('typing');

    const userInfo = JSON.stringify({
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name,
    });
    const { reply } = await replyGrok(
      [
        {
          role: 'user',
          content: `Greet me with a roasting based on this information: ${userInfo}. If nothing is provided, just make a general roasting. End the message with: "By the way, I have a hilarious joke for ya:"`,
        },
      ],
      '',
    );

    const message = reply || Message.Greeting;

    await ctx.reply(message);
    await ctx.reply(InitialJoke.joke, {
      reply_markup: {
        inline_keyboard: [
          getVoteInlineButtons(InitialJoke.id, true, true),
          getExplainInlineButton(InitialJoke.id, true, true),
        ],
      },
    });
    await ctx.replyWithVoice(InitialJoke.jokeVoiceId);
    await usersDB.saveUser(ctx.from as User);

    await sendMessageToAdmin(
      `New User: ${JSON.stringify(ctx.from)}\n\nMessage: ${message}`,
    );
  } catch (error) {
    await handleError('startCommand', error);
  }
});

bot.on('my_chat_member', async ctx => {
  try {
    const { status } = ctx.myChatMember.new_chat_member;
    const kid = await usersDB.getUser(ctx.chat.id);

    if (kid && status === Status.Kicked) {
      await usersDB.deactivateUser(ctx.chat.id);

      await sendMessageToAdmin(`User left: ${JSON.stringify(ctx.from)}`);

      return;
    }
  } catch (error) {
    await handleError('myChatMemberCommand', error);
  }
});
