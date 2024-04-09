module.exports = {
  name: "ping",
  description: "Pong!",
  // devOnly: Boolean,
  // testOnly: true,
  // options: Object[],
  // deleted: Boolean,

  callback: async (client, interaction) => {
    await interaction.deferReply();

    // fetch the information from the defer reply
    const reply = await interaction.fetchReply();

    // compare the timestamp of the reply with the timestamp of the interaction to get the ping
    const ping = reply.createdTimestamp - interaction.createdTimestamp;

    interaction.editReply(
      `Pong! Client ${ping}ms | Websocket: ${client.ws.ping}ms`,
    );
  },
};
