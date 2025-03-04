import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

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
  summary?: string;
  personalityTraits?: string;
  currentHistory?: string[] | ChatCompletionMessageParam[];
  history?: string[];
  allTokens?: number;
  currentTokens?: number;
}

export interface MyUserSchedule extends Pick<MyUser, 'id' | 'startDate'> {}
