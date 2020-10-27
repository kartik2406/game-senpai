const axios = require("axios").default;
const constants = require("./constants");
const Discord = require("discord.js");
const format = require("date-fns/format");
const { random } = require("lodash");
const { COMMMAND_RESPONSES } = require("./constants");

axios.interceptors.request.use((x) => {
  // to avoid overwriting if another interceptor
  // already defined the same object (meta)
  x.meta = x.meta || {};
  x.meta.requestStartedAt = new Date().getTime();
  return x;
});

axios.interceptors.response.use(
  (x) => {
    console.log(
      `Execution time for: ${x.config.url} - ${
        new Date().getTime() - x.config.meta.requestStartedAt
      } ms`
    );
    return x;
  },
  // Handle 4xx & 5xx responses
  (x) => {
    console.error(
      `Execution time for: ${x.config.url} - ${
        new Date().getTime() - x.config.meta.requestStartedAt
      } ms`
    );
    throw x;
  }
);

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

const getSubsriberFromHook = ({ id, name, channelID, token }) => ({
  id,
  name,
  channelID,
  token,
});

const getAirtableURI = (tableName) =>
  `${constants.AIRTABLE_BASE_URL}/${process.env.AIRTABLE_ID}/${tableName}`;

const getSubscribers = async () => {
  try {
    let subscribers = await axios({
      url: getAirtableURI("Subsribers"),
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
      },
    });
    subscribers = subscribers.data;
    subscribers = subscribers.records.map((record) => record.fields);
    return subscribers;
  } catch (err) {
    console.error("Error fetching subsribers");
    return [];
  }
};

const addSubscriber = async (subscriber) => {
  try {
    await axios.post(
      getAirtableURI("Subsribers "),
      {
        records: [
          {
            fields: subscriber,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Could not add record to the table", err);
  }
};

const isSubscribed = (subscribers, channelID) => {
  let subscribedChannels = subscribers.map(
    (subscriber) => subscriber.channelID
  );
  return subscribedChannels.includes(channelID);
};

const subscribe = async (message) => {
  const subscribers = await getSubscribers();
  let channelID = message.channel.id;
  if (isSubscribed(subscribers, channelID)) {
    message.reply(
      "Oh cool, looks like this channel is already subscribed for weekly updates. Will keep you posted."
    );
  } else {
    try {
      let webhook = await message.channel.createWebhook(
        constants.WEB_HOOK_NAME,
        {
          avatar:
            "https://cdn.discordapp.com/avatars/769239856814620723/8de7bc035011cc11e912c780b4b5fd65.webp",
        }
      );
      addSubscriber(getSubsriberFromHook(webhook));
      message.reply(
        "Awesome! This channel is now subscribed to weekly updates. Will keep you posted."
      );
    } catch (err) {
      console.error("Error while subsribing, could not create webhook", err);
      message.reply(
        "Sorry! we could not complete your request. Please try again later."
      );
    }
  }
};
const executeCommand = async (command, args, message) => {
  // If you need to perform any specific action based on a command then you would need a case statement
  // If its just text reply it will be handled by default, just add replies in the constant file
  switch (command) {
    case constants.COMMANDNAMES.FREE:
      message.reply("Checking for this weeks free games on EPIC Store");
      let games = await getWeeklyFreeEpicGames();
      let embeds = games.map((game) => getFreeGamesEmbed(game));
      embeds.forEach((embed) => message.channel.send({ embed }));

      break;
    case constants.COMMANDNAMES.SUBSCRIBE:
      message.reply("Sure, I will get it done right away!");
      await subscribe(message);
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
  getSubscribers,
};
