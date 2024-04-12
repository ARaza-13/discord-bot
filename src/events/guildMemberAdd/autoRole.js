const { Client, GuildMember } = require("discord.js");
const AutoRole = require("../../models/AutoRole");

// import Client and GuildMember intellisense from discord.js
/**
 *
 * @param {Client} client
 * @param {GuildMember} member
 */
module.exports = async (client, member) => {
  try {
    // define the guild
    let guild = member.guild;
    if (!guild) return;

    // get the autorole document from the database
    const autoRole = await AutoRole.findOne({ guildId: guild.id });
    if (!autoRole) return;

    await member.roles.add(autoRole.roleId);
  } catch (error) {
    console.log(`Error giving role automatically: ${error}`);
  }
};
