export interface MyUser {
  id: string;
  explanations: number;
  isActive: boolean;
  isBot: boolean;
  isPremium: boolean;
  languageCode: string;
  startDate: string;
  scheduleHoursUTC: number;
  endDate?: string;
  firstName?: string;
  lastName?: string;
  reactDate?: string;
  username?: string;
}

export interface MyUserSchedule
  extends Pick<MyUser, 'id' | 'scheduleHoursUTC'> {}
