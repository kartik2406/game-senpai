//@ts-check
const utils = require("./utils");
const channelID = process.env.channelID; // TODO: To be read from config
const Discord = require("discord.js");

const webHookClient = new Discord.WebhookClient(
  process.env.WEBHOOK_ID,
  process.env.WEBHOOK_TOKEN
);

exports.handler = async (event) => {
  let games = await utils.getWeeklyFreeEpicGames();
  console.log("Games received", games);
  if (games) {
    let embeds = utils.getFreeGamesEmbed(games);
    await webHookClient.send({
      embeds,
    });
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
