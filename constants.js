module.exports = {
  AIRTABLE_BASE_URL: 'https://api.airtable.com/v0',
  WEB_HOOK_NAME: "Game-Senpai",
  COMMANDNAMES: {
    HELLO: "HELLO",
    FREE: "FREE",
    SUBSCRIBE: "SUBSCRIBE",
  },
  COMMMAND_RESPONSES: {
    HELLO: ["Hello friend!", "Well hello there!"],
    //TODO: Maybe seperate into good-cop / bad-cop style messages
    COOL: [
      "Cool, cool, cool, cool, cool, cool",
      "Cool, cool, cool, cool, cool, cool. No doubt, no doubt, no doubt",
      "Tea is nothing more than hot leaf juice!",
      "This guy is too good he shoots fire from his brain",
      "Never send a human to do a machine's job",
      "Frankly, my dear, I don't give a damn",
      "Trinity",
      "0118 999 881 999 119 7253",
      "The Elders of the Internet know who I am?!",
      "Have you tried turning it off and on again?",
      "Hodor",
      "You know nothing, Jon Snow",
      "Winter is coming",
      "They're just robots, Morty! It's OK to shoot them! They're robots!",
      "You met me at a very strange time in my life",
      "Just because someone stumbles and loses their path, doesn't mean they're lost forever",
      "Dodge this",
      "Stop trying to hit me and hit me",
      "Do you think that's air you're breathing now?",
      "If you really need a mystery, I recommend the human heart",
      "You can't play God without being acquainted with the devil",
      "Ah yes, I was wondering what would break first. Your spirit, or your body?",
      "Why So Serious?",
      "You either die a hero or live long enough to see yourself become the villian",
      "Mr. Stark, I don't feel so good",
      "Get ready to fight",
      "Calm down, Doctor! Now's not the time for fear. That comes later",
      "These violent delights have violent ends",
      "I'm sorry, but your opinion means very little to me",
      "Another day another Doug",
      "Bring me Thanos!",
      "Just remember, the sweet is never as sweet without the sour",
      "We create our own demons",
      "I'm gonna make him an offer he can't refuse",
      "Hope is a good thing, maybe the best of things, and no good thing ever dies",
      "We have a hulk!",
      "Never trust anyone too much, remember the devil was once an angel",
      "No. Try not. Do… or do not. There is no try.",
      "I Love You 3000",
      "Scissors cuts paper, paper covers rock, rock crushes lizard, lizard poisons Spock, Spock smashes scissors, scissors decapitates lizard, lizard eats paper, paper disproves Spock, Spock vaporizes rock, and as it always has, rock crushes scissors.",
      "Wubba lubba dub dub!",
      "yabadabadoo!",
      "Our deepest fear is not that we are inadequate. Our deepest fear is that we are powerful beyond measure.",
      "The hardest choices require the strongest wills",
      "People don't wanna follow an idea, they wanna follow a leader",
      "One often meets his destiny on the road he takes to avoid it",
      "May the Force be with you",
      "Loyalty, Honor, A willing heart, i can ask no more than that.",
      "Dread it, run from it, destiny arrives all the same..",
      "A million dollars isn't cool. You know what's cool? A billion dollars..",
      "We're all going to die. The only question is how.",
      "Nobody exists on purpose. Nobody belongs anywhere. Everybody's gonna die. Come watch TV.",
      "Life is effort and I'll stop when I die!",
      "Treat yo self",
      "Worst. Episode. Ever",
      "Happiness can be found even in the darkest of times, when one only remembers to turn on the light.",
      "The most dangerous man in the world is the one who doesn't know what he doesn't know.",
      "Are you paying attention?",
      "I am running away from my responsibilities. And it feels good.",
    ],
  },
  COMMANDS: [
    {
      id: "HELLO",
      name: "Greeting",
      keywords: ["Hey", "Hi", "Hello", "Heya", "Hola"],
    },
    {
      id: "FREE",
      name: "Search Free Games",
      keywords: [
        "Free",
        "Suggest some free games",
        "I want some free games",
        "I want free games",
        "Is Epic giving away free games?",
      ],
    },
    {
      id: "SUBSCRIBE",
      name: "Subsribe to weekly updates",
      keywords: [
        "Subscribe",
        "Keep me posted",
        "Epic updates",
        "Weekly updates",
      ],
    },
  ],
  DATE_FORMAT: "do MMMM hh:mm a",
  APIS: {
    EPIC_STORES_WEEKLY_FREE_GAMES:
      "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=IN&allowCountries=IN",
    EPIC_STORES_URL: "https://www.epicgames.com/store/en-US/product",
  },
};
