const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("target-user").value;
    const duration = interaction.options.get("duration").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();

    // get the target user object and check if they're still in the server
    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    // check if target user is a bot
    if (targetUser.user.bot) {
      await interaction.editReply("I can't timeout a bot.");
      return;
    }

    // convert duration to milliseconds
    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply("Please provide a valid timeout duration.");
      return;
    }

    // check if msDuration is less than 5 seconds or more than 28 days
    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(
        "Timeout duration cannot be less than 5 seconds or more than 28 days.",
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
        "You can't timeout that user because they have the same/higher role than you.",
      );
      return;
    }

    if (targetUserRolePosition >= botRolePermissions) {
      await interaction.editReply(
        "I can't timeout that user because they have the same/higher role than me.",
      );
      return;
    }

    // timeout the user
    try {
      const { default: prettyMs } = await import("pretty-ms");

      // check if the target user is already timed out to update the duration
      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(
          `${targetUser}'s timeout has been updated to ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`,
        );
        return;
      }

      // time out the target user normally
      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(
        `${targetUser} was timed out for ${prettyMs(msDuration, { verbose: true })}\nReason: ${reason}`,
      );
    } catch (error) {
      console.log(`There was an error when timing out: ${error}`);
    }
  },

  name: "timeout",
  description: "Timeout a user.",
  options: [
    {
      name: "target-user",
      description: "The user you want to timeout.",
      type: ApplicationCommandOptionType.Mentionable,
      require: true,
    },
    {
      name: "duration",
      description: "Timeout duration (30m, 1h, 1 day).",
      type: ApplicationCommandOptionType.String,
      require: true,
    },
    {
      name: "reason",
      description: "The reason for the timeout.",
      type: ApplicationCommandOptionType.String,
    },
  ],

  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botPermissions: [PermissionFlagsBits.MuteMembers],
};
