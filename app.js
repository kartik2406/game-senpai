const Discord = require("discord.js");
const utils = require("./utils");
const bot = new Discord.Client();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const token = process.env.TOKEN;

bot.login(token);

bot.once("ready", () => {
  console.log("Bot is online!");
});
bot.on("message", async (message) => {
  if (message.author.bot) return;
  const botID = bot.user.id;

  const mentionIDs = message.mentions.users.map((user) => user.id);

  // if bot is not mentioned ignore the message
  if (!mentionIDs.includes(botID)) {
    return;
  }

  let prefix = `<@!${botID}>`;
  const withoutPrefix = message.content.slice(prefix.length).trim();
  const messageCommand = utils.getValidCommand(withoutPrefix);
  // Check if the entire message is the command

  if (messageCommand) {
    await utils.executeCommand(messageCommand, message);
  } else {
    //TODO:
    // command must contain args, parse the string to split it
    const split = withoutPrefix.split(" ");
    const command = split[0];
    const args = split.slice(1);
    console.log({ command, args });
  }
});
