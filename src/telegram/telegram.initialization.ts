import { Bot } from 'grammy';
import { logger } from '../grammy/middlwares/logger.middleware';

export const bot = new Bot(process.env.BOT_TOKEN as string);

bot.use(logger);
