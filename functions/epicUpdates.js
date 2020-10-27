//@ts-check
const utils = require("./utils");
const Discord = require("discord.js");

exports.handler = async (event) => {
  try {
    let [games, subscribers] = await Promise.all([
      utils.getWeeklyFreeEpicGames(),
      utils.getSubscribers(),
    ]);

    const webHookClients = subscribers.map(
      (subscriber) => new Discord.WebhookClient(subscriber.id, subscriber.token)
    );
    console.log("Games received", games);
    if (games) {
      let embeds = games.map((game) => utils.getFreeGamesEmbed(game));
      let sendUpdates = webHookClients.map((webHookClient) =>
        webHookClient.send(embeds)
      );
      await Promise.all(sendUpdates);
      console.log("Messages sent");
      return {
        statusCode: 200,
        body: "Updates sent to subscribers",
      };
    }
  } catch (err) {
    console.error("Error occurred", err);
  }
  return {
    statusCode: 400,
    body: "Could not send updates to subscriber",
  };
};
