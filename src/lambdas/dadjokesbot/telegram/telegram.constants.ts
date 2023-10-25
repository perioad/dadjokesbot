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
  "Hey champ! You know, just like how too much candy isn't good for you, too many jokes can be a bit much. One a day keeps the frowns away!",
  "Remember that time you wanted more ice cream and got a brain freeze? That's why one joke a day is the sweet spot, buddy!",
  "Pal, have you ever noticed that the best things in life come in small doses? Just like our daily jokes. Makes 'em special, doesn't it?",
  "You know, kiddo, if I gave you all your toys at once, you'd get bored of them quickly. Same goes for jokes. One a day is just the right pace!",
  "Ever heard of the saying 'less is more'? Well, that's how we roll with our jokes. Trust me, it's the dad way of doing things!",
];

export const enum CallbackAction {
  Upvote = 'upvote',
  Downvote = 'downvote',
  Explain = 'explain',
}
