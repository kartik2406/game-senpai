const utils = require("../utils");
const channelID = process.env.channelID; // TODO: To be read from config
const Discord = require("discord.js");
const bot = new Discord.Client();

const token = process.env.TOKEN;

bot.login(token);

const getChannel = (channelID) => {
  return new Promise((resolve, reject) => {
    bot.once("ready", () => {
      const channel = bot.channels.fetch(channelID);
      resolve(channel);
    });
  });
};
module.exports = async (req, res) => {
  let games = await utils.getWeeklyFreeEpicGames();

  if (games) {
    const channel = await getChannel(channelID);
    let messagePromises = games.map((game) =>
      channel.send(utils.getFreeGamesEmbed(game))
    );

    await Promise.all(messagePromises);

    return res.json({
      status: 200,
      body: {
        message: "Games found",
      },
    });
  }
  return res.json({
    status: 400,
    body: {
      message: "No games found",
    },
  });
};
