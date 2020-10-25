//@ts-check
const utils = require("./utils");
const channelID = process.env.channelID; // TODO: To be read from config
const Discord = require("discord.js");
const { reject } = require("lodash");
const bot = new Discord.Client();

const token = process.env.TOKEN;

bot.login(token);

bot.on;

const getChannel = (channelID) => {
  return new Promise((resolve, reject) => {
    bot.on("ready", () => {
      const channel = bot.channels.fetch(channelID);
      resolve(channel);
    });
  });
};
exports.handler = async (event) => {
  let games = await utils.getWeeklyFreeEpicGames();

  if (games) {
    const channel = await getChannel(channelID);
    let messagePromises = games.map((game) =>
      channel.send(utils.getFreeGamesEmbed(game))
    );

    await Promise.all(messagePromises);

    return {
      statusCode: 200,
      body: `Games found`,
    };
  }
  return {
    statusCode: 400,
    body: `No games found`,
  };
};
