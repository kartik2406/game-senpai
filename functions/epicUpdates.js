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
    channel.games.forEach((game) =>
      channel.send(utils.getFreeGamesEmbed(game))
    );
  }
  const subject = event.queryStringParameters.name || "World";
  return {
    statusCode: 200,
    body: `Hello ${subject}!`,
  };
};
