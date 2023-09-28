import { Bot } from 'grammy';
import { logger } from '../grammy/middlwares/logger.middleware';

export const bot = new Bot(process.env.API_KEY_BOT as string);

bot.use(logger);
