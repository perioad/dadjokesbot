import { Bot } from 'grammy';
import { logger } from '../../../core/grammy/middlwares/logger.middleware';

export const bot = new Bot(process.env.BOT_TOKEN as string);

bot.use(logger);
