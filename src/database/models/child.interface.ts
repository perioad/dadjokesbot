export interface Child {
  id: string;
  explanationsCount: number;
  feedbacks: string[];
  isActive: boolean;
  isBot: boolean;
  languageCode: string;
  startDate: string;
  endDate?: string;
  firstName?: string;
  lastName?: string;
  reactDate?: string;
  username?: string;
}
