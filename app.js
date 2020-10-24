const Discord = require("discord.js");
const constants = require("./constants");
const utils = require("./utils");
const bot = new Discord.Client();

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const token = process.env.TOKEN;

bot.login(token);

bot.once("ready", () => {
  console.log("Bot is online!");
});
bot.on("message", async (message) => {
  if (message.author.bot) return;
  const botID = bot.user.id;

  console.log(botID);
  const mentionIDs = message.mentions.users.map((user) => user.id);

  // if bot is not mentioned ignore the message
  if (!mentionIDs.includes(botID)) {
    return;
  }
  console.log("Message content", message.content);
  message.reply("Hello there");
  let prefix = `<@!${botID}>`;
  const withoutPrefix = message.content.slice(prefix.length).trim();
  const split = withoutPrefix.split(" ");
  const command = split[0];
  const args = split.slice(1);
  console.log({ command, args });

  if (command.toUpperCase() == constants.COMMANDS.FREE) {
    message.reply("Searching for this weeks free games on EPIC Stores");
    let games = await utils.getWeeklyFreeEpicGames();

    if (games) {
      games.forEach((game) =>
        message.channel.send(utils.getFreeGamesEmbed(game))
      );
    }

    console.log(games);
  }
});
