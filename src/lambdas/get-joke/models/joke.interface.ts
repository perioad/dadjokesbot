export interface Joke {
  id: string;
  joke: string;
  upvote: number;
  downvote: number;
  jokeVoiceId: string;
  explanationVoiceId: string;
  date: string;
}

export interface ExplainedJoke extends Joke {
  explanation: string;
}
