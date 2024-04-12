const { Client, Interaction, PermissionFlagsBits } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

module.exports = {
  // import Client and Interaction intellisense from discord.js
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    try {
      await interaction.deferReply();

      // check if auto-role is already configured in the server
      // by checking if a document exists in the database with the guildId
      if (!(await AutoRole.exists({ guildId: interaction.guild.id }))) {
        interaction.editReply(
          "Auto Role has not been configured for this server. Use `/autorole-configure` to set it up.",
        );
        return;
      }

      // if auto-role is configured, then delete the document from the database
      await AutoRole.findOneAndDelete({ guildId: interaction.guildId });
      interaction.editReply(
        "Auto Role has been disabled for this server. Use `/autorole-configure` to set it up again.",
      );
    } catch (error) {
      console.log(`Error with /autorole-disable: ${error}`);
    }
  },

  name: "autorole-disable",
  description: "Disable auto-role in this server.",
  permissionsRequired: [PermissionFlagsBits.Administrator],
};
