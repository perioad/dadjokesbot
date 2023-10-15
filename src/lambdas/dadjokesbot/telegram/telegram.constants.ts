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
};

export const OLD_EXPLAIN_BUTTON = 'Explain this joke, dad';

export const InitialJoke = {
  id: '218xkq49prc',
  joke: `A guy was fired from the keyboard factory yesterday. He wasn't putting in enough shifts.`,
};

export const LISTENING_MESSAGES = [
  `Well, look who's trying to chat! Remember, I'm the dad here, so it's my job to tell the jokes, not yours. No need to message, just wait and laugh!`,
  `Hey kiddo! I see someone skipped reading the manual again. 🙄 Don't message, just sit tight, and I'll bring the fun to you.`,
  `Someone's eager for a laugh! But here's a pro tip: I don't read your messages. Maybe you should read my description though? 😉`,
  `You know, back in my day, we read instructions! I'll keep the jokes coming, and you keep the giggles up. No messaging required!`,
  `Trying to talk to me, huh? Well, jokes on you, I only talk once a day. But don't worry, you'll hear from me soon enough. Patience, young grasshopper.`,
];

export const enum CallbackAction {
  Upvote = 'upvote',
  Downvote = 'downvote',
  Explain = 'explain',
}
