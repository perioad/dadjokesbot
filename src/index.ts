import { bot } from './telegram/initialization';
import { webhookCallback } from 'grammy';
import './telegram/commands';

export const handler = webhookCallback(bot, 'aws-lambda');
