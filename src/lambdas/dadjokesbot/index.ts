import { bot } from './telegram/telegram.initialization';
import { webhookCallback } from 'grammy';
import './telegram/commands';

// track anniversaries
// check status codes in tg bot and aws lambda
export const handler = webhookCallback(bot, 'aws-lambda', 'return');
