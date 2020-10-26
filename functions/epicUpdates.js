//@ts-check
const utils = require("./utils");
const channelID = process.env.channelID; // TODO: To be read from config
const Discord = require("discord.js");
const bot = new Discord.Client();

const token = process.env.TOKEN;
bot.login(token);
let channel;
bot.on("ready", () => {
  console.log("Bot is ready!");
  channel = bot.channels.fetch(channelID);
});
const getChannel = (channelID) => {
  return channel;
};
exports.handler = async (event) => {
  let games = await utils.getWeeklyFreeEpicGames();
  console.log("Games received", games);
  if (games) {
    const channel = await getChannel(channelID);
    let messagePromises = games.map((game) =>
      channel.send(utils.getFreeGamesEmbed(game))
    );

    await Promise.all(messagePromises);
    console.log("Messages sent");
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
