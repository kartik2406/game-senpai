//@ts-check
const utils = require("./utils");
const channelID = process.env.channelID; // TODO: To be read from config
const Discord = require("discord.js");
const bot = new Discord.Client();

const token = process.env.TOKEN;

bot.login(token);

exports.handler = async (event) => {
  let games = await utils.getWeeklyFreeEpicGames();

  if (games) {
    const channel = bot.channels.cache.get(channelID);

    games.forEach((game) => channel.send(utils.getFreeGamesEmbed(game)));
  }
  const subject = event.queryStringParameters.name || "World";
  return {
    statusCode: 200,
    body: `Hello ${subject}!`,
  };
};
