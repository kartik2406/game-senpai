module.exports = {
  COMMANDNAMES: {
    HELLO: "HELLO",
    FREE: "FREE",
  },
  COMMANDS: [
    {
      id: "HELLO",
      name: "Greeting",
      keywords: ["Hey", "Hello", "Heya", "Hola"],
      responses: ["Hello friend!"],
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
  ],
  DATE_FORMAT: "do MMMM hh:mm a",
  APIS: {
    EPIC_STORES_WEEKLY_FREE_GAMES:
      "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=en-US&country=IN&allowCountries=IN",
    EPIC_STORES_URL: "https://www.epicgames.com/store/en-US/product",
  },
};
