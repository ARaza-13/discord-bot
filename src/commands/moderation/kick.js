const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  // import Client and Interaction intellisense from discord.js
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get("target-user").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    // get the target user object and check if they're still in the server
    const targetUser = await interaction.guild.members.fetch(targetUserId);
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    // check if target user is not the server owner
    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply(
        "You can't kick that user because they're the server owner.",
      );
      return;
    }

    // check the role positions of the target user, request user, and the bot user
    const targetUserRolePosition = targetUser.roles.highest.position; // highest role of the target role
    const requestUserRolePosition = interaction.member.roles.highest.position; // highest role of the user running the command
    const botRolePermissions =
      interaction.guild.members.me.roles.highest.position; // highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You can't kick that user because they have the same/higher role than you.",
      );
      return;
    }

    if (targetUserRolePosition >= botRolePermissions) {
      await interaction.editReply(
        "I can't kick that user because they have the same/higher role than me.",
      );
      return;
    }

    // kick the user
    try {
      await targetUser.kick(reason);
      await interaction.editReply(
        `User ${targetUser} was kicked\nReason: ${reason}`,
      );
    } catch (error) {
      console.log(`There was an error when kicking: ${error}`);
    }
  },

  name: "kick",
  description: "Kicks a member from this server.",
  // devOnly: Boolean,
  // testOnly: Boolean,
  options: [
    {
      name: "target-user",
      description: "The user you want to kick.",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "The reason for kicking.",
      type: ApplicationCommandOptionType.String,
    },
  ],

  // permissions for the person running the command &
  // permissions for the bot to execute the command
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
};
