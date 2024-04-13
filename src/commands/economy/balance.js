const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
} = require("discord.js");
const User = require("../../models/User");

module.exports = {
  // import Client and Interaction intellisense from discord.js
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    // check if command was ran in a server
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server.",
        ephemeral: true,
      });
      return;
    }

    // get the target userId
    // if no target user was provided, get the id of the user running command
    const targetUserId =
      interaction.options.get("user")?.value || interaction.member.id;

    await interaction.deferReply();

    // find the user from the database
    const user = await User.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!user) {
      interaction.editReply(`<@${targetUserId}> doesn't have a profile yet.`);
      return;
    }

    interaction.editReply(
      targetUserId === interaction.member.id // if target user is the person running the command
        ? `Your balance is **${user.balance}**`
        : `<@${targetUserId}>'s balance is **${user.balance}**`,
    );
  },

  name: "balance",
  description: "See yours/someone else's balance",
  options: [
    {
      name: "user",
      description: "The user whose balance you want to get.",
      type: ApplicationCommandOptionType.User,
    },
  ],
};
