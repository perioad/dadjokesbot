export interface Joke {
  id: string;
  joke: string;
}

export interface ExplainedJoke extends Joke {
  explanation: string;
}
