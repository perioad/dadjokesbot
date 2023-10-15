import { DAY_MS } from '../../core/constants/date.constants';
import { DAYS_TO_ANNIVERSARY_MAP } from './messages';

export const getAnniversaryMessage = (
  startDateRaw: string,
): string | undefined => {
  const startDate = new Date(startDateRaw).setHours(0, 0, 0, 0);
  const todayDate = new Date().setHours(0, 0, 0, 0);
  const timeDifference = todayDate - startDate;
  const daysDifference = timeDifference / DAY_MS;
  const message = DAYS_TO_ANNIVERSARY_MAP[daysDifference];

  return message;
};
