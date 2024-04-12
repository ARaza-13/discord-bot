const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
  PermissionFlagsBits,
} = require("discord.js");
const AutoRole = require("../../models/AutoRole");

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
      interaction.reply("You can only run this command inside a server.");
      return;
    }

    const targetRoleId = interaction.options.get("role").value;

    try {
      await interaction.deferReply();

      // check if an autorole document already exists in the database
      let autoRole = await AutoRole.findOne({ guildId: interaction.guild.id });

      if (autoRole) {
        // check if autorole id that user provided matches the id in the database
        if (autoRole.id === targetRoleId) {
          interaction.editReply(
            "Auto role has already been configured for that role. To disable, run `/autorole-disable`",
          );
          return;
        }

        // if the ids don't match, then update the existing document
        autoRole.roleId = targetRoleId;
      } else {
        // if (!autoRole), then assign a new autorole document
        autoRole = new AutoRole({
          guildId: interaction.guild.id,
          roleId: targetRoleId,
        });
      }

      // save updated/new autorole to database
      await autoRole.save();
      interaction.editReply(
        "Autorole has been configured. To disable, run `/autorole-disable` ",
      );
    } catch (error) {
      console.log(`There was an error running this command: ${error}`);
    }
  },

  name: "autorole-configure",
  description: "Configure your auto-role for this server.",
  options: [
    {
      name: "role",
      description: "The role you want users to get on join.",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.ManageRoles],
};
