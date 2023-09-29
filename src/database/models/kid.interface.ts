export interface Kid {
  id: string;
  explanationsCount: number;
  feedbacks: string[];
  isActive: boolean;
  isBot: boolean;
  isPremium: boolean;
  languageCode: string;
  startDate: string;
  endDate?: string;
  firstName?: string;
  lastName?: string;
  reactDate?: string;
  username?: string;
}
