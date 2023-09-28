import { bot } from '../initialization';

bot.command('start', async ctx => {
  await ctx.reply('yo');

  return;
});

bot.on('my_chat_member', async ctx => {
  await ctx.reply('yo2');

  return;
});
