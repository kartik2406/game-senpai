const axios = require("axios");
const constants = require("./constants");
const Discord = require("discord.js");
const format = require("date-fns/format");

const textForFreeGames = (games) => {
  return games.map(
    (game) => `${game.title} is currently free until ${game.offerDates.endDate}`
  );
};

const getWeeklyFreeEpicGames = async () => {
  try {
    let response = await axios(constants.APIS.EPIC_STORES_WEEKLY_FREE_GAMES);

    response = response.data;

    let freeGamesList = response.data.Catalog.searchStore.elements.map(
      (gameDetails) => {
        let publisher = "",
          developer = "";
        gameDetails.customAttributes.forEach((attr) => {
          if (attr.key == "publisherName") publisher = attr.value;
          if (attr.key == "developerName") developer = attr.value;
        });

        let offerDetails = gameDetails.promotions.promotionalOffers.length
          ? gameDetails.promotions.promotionalOffers
          : gameDetails.promotions.upcomingPromotionalOffers;

        offerDetails = offerDetails[0].promotionalOffers[0];
        let game = {
          title: gameDetails.title,
          images: gameDetails.keyImages,
          url: `${constants.APIS.EPIC_STORES_URL}/${gameDetails.productSlug}`,
          offerDates: {
            startDate: new Date(offerDetails.startDate),
            endDate: new Date(offerDetails.endDate),
          },
          publisher,
          developer,
          originalPrice: gameDetails.price.totalPrice.fmtPrice.originalPrice,
          discountPrice: gameDetails.price.totalPrice.fmtPrice.discountPrice,
        };
        return game;
      }
    );
    let currentFreeGames = freeGamesList.filter(
      (game) =>
        game.discountPrice === "0" || game.offerDates.endDate <= new Date()
    );
    console.log("Current Free games", JSON.stringify(currentFreeGames));
    return currentFreeGames;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const getFreeGamesEmbed = (game) => {
  let image = game.images[0].url;
  let thumbNail = game.images[1] ? game.images[1].url : game.images[0].url;
  const freeGameEmbed = new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(game.title)
    .setAuthor("Currently free on Epic Games store")
    .setURL(game.url)
    .setDescription(
      `Actual price of this game is ${game.originalPrice}, currently its FREE!`
    )
    .setThumbnail(thumbNail)
    .addFields(
      {
        name: "Claim it before offer expires!",
        value: `${format(game.offerDates.endDate, constants.DATE_FORMAT)}`,
      },
      {
        name: "Developer",
        value: game.developer,
      },
      {
        name: "Publisher",
        value: game.publisher,
      }
    )
    .setImage(image)
    .setTimestamp();
  return freeGameEmbed;
};
module.exports = {
  getWeeklyFreeEpicGames,
  getFreeGamesEmbed,
};
