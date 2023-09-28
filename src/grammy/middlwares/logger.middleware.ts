import { Context, NextFunction } from 'grammy';
import { log } from '../../utils/logger';

export const logger = async (ctx: Context, next: NextFunction) => {
  log('event', JSON.stringify(ctx.update));

  await next();
};
