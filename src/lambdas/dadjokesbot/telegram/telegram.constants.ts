export const enum Status {
  Kicked = 'kicked',
}

export const Message = {
  Greeting: `Hey kid 😎\nAlways wanted to tell you that I'm proud of you 🤘🏼\n\nBy the way, I have a hilarious joke for ya:`,
  ComeBack: `Hello dear!\nI missed you soooooo much ❤️\nRemember my favourite joke?`,
  AlreadyActive: `Don't be so silly. Our disscussion is already started 😉`,
  SomethingWentWrong: `Hey dear, something went not as expected 🥺\nPlease write @perioad and everything's going to be alright 🤗`,
  Downvote: `Well, I guess I've reached peak 'Dad Joke' level when even my own kid downvotes me! Time to level up! 😂`,
  Upvote: `Ah, an upvote from my kid? Now that's the seal of dad joke approval! Prepare for more puns! 😁`,
  NewExplain: `Sorry kid, but joke explanations don't work this way anymore. Now it's way more cooler as every joke is going to have it's own explain button! How awesome is that? 😎`,
  LongMessage: `Your message is toooooooooo loooooooooooong...`,
  NoExplanation: `Sorry kid, can't come up with an explanation for this one 😔`,
  DadHasNoConnection: `Dad has lost the internet connection, try later bip bop bip 📵`,
};

export const OLD_EXPLAIN_BUTTON = 'Explain this joke, dad';

export const InitialJoke = {
  id: '218xkq49prc',
  joke: `A guy was fired from the keyboard factory yesterday. He wasn't putting in enough shifts.`,
};

export const LISTENING_MESSAGES = [
  "If you want another joke, I have bad news for you - jokes only once a day. If you asking something - sorry, I'm not smart enough. The only thing I can do - send one joke a day :)",
];

export const enum CallbackAction {
  Upvote = 'upvote',
  Downvote = 'downvote',
  Explain = 'explain',
}
