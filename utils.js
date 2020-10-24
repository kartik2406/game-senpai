const axios = require("axios");
const constants = require("./constants");
const Discord = require("discord.js");
const format = require("date-fns/format");
const { random } = require("lodash");
const { COMMMAND_RESPONSES } = require("./constants");
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

const getValidCommand = (command) => {
  for (let validCommand of constants.COMMANDS) {
    let keyWords = validCommand.keywords;
    if (
      keyWords.some((keyWord) => keyWord.toLowerCase() == command.toLowerCase())
    )
      return validCommand.id;
  }
  return false;
};

const saySomethingCool = (message) => {
  let coolResponses = COMMMAND_RESPONSES.COOL;
  let toal = coolResponses.length - 1;
  message.reply(coolResponses[random(0, toal)]);
};

const executeCommand = async (command, args, message) => {
  // If you need to perform any specific action based on a command then you would need a case statement
  // If its just text reply it will be handled by default, just add replies in the constant file
  console.log(command, args);
  switch (command) {
    case constants.COMMANDNAMES.FREE:
      message.reply("Checking for this weeks free games on EPIC Store");
      let games = await getWeeklyFreeEpicGames();

      if (games) {
        games.forEach((game) => message.channel.send(getFreeGamesEmbed(game)));
      }

      break;
    default:
      let availableResponses = COMMMAND_RESPONSES[command]
        ? COMMMAND_RESPONSES[command].length
        : 0;
      if (availableResponses) {
        let responseNo = random(0, availableResponses - 1);
        let response = COMMMAND_RESPONSES[command][responseNo];
        message.reply(response);
      } else {
        // Opps, I don't understand this. Dont Panic, Say something cool!
        console.log("Not recogzined");
        saySomethingCool(message);
      }
  }
};
module.exports = {
  getWeeklyFreeEpicGames,
  getFreeGamesEmbed,
  getValidCommand,
  executeCommand,
  saySomethingCool,
};
