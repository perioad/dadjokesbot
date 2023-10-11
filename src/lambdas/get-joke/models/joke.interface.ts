export interface Joke {
  id: string;
  joke: string;
  upvote: number;
  downvote: number;
}

export interface ExplainedJoke extends Joke {
  explanation: string;
}
