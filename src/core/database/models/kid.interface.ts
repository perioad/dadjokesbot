export interface MyUser {
  id: string;
  explanationsCount: number;
  feedbacks: string[];
  isActive: boolean;
  isBot: boolean;
  isPremium: boolean;
  languageCode: string;
  startDate: string;
  scheduleHours: number;
  endDate?: string;
  firstName?: string;
  lastName?: string;
  reactDate?: string;
  username?: string;
}

export interface MyUserSchedule extends Pick<MyUser, 'id' | 'scheduleHours'> {}
