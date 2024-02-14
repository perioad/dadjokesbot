import { Bot } from 'grammy';
import { InlineKeyboardButton } from 'grammy/types';

export const sendMessage = async (
  chatId: string,
  message: string,
  voiceMessageId: string,
  inlineKeyboard?: InlineKeyboardButton.CallbackButton[][],
): Promise<void> => {
  const bot = new Bot(process.env.BOT_TOKEN as string);

  await bot.api.sendMessage(
    chatId,
    message,
    inlineKeyboard
      ? {
          reply_markup: { inline_keyboard: inlineKeyboard },
          parse_mode: 'HTML',
        }
      : undefined,
  );

  if (voiceMessageId) {
    await bot.api.sendVoice(chatId, voiceMessageId);
  }
};
