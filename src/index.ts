import { bot } from './telegram/telegram.initialization';
import { webhookCallback } from 'grammy';
import './telegram/commands';

// track anniversaries
export const handler = webhookCallback(bot, 'aws-lambda');
