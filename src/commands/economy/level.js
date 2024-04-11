const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const { Font, RankCardBuilder } = require("canvacord");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const Level = require("../../models/Level");

Font.loadDefault();

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

    await interaction.deferReply();

    // get the target user (if it exists)
    // determine the userID for the person whose rank is being fetched
    // if mentionedUserId doesn't exist, just get the level of the person running the command
    const mentionedUserId = interaction.options.get("target-user")?.value;
    const targetUserId = mentionedUserId || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);

    // get the level from the database using a query
    // & check if the level exists
    const fetchedLevel = await Level.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        // return two possible responses
        // one for the mentioned user's level or one for the person running the command trying to get their own level
        mentionedUserId
          ? `${targetUserObj.user.tag} doesn't have any levels yet. Try again when they chat a little more.`
          : "You don't have any levels yet. Chat a little more and try again.",
      );
      return;
    }

    // if (fetchedLevel), get the rank of the user
    // must determine where they are in the list of users by getting every level in the server
    let allLevels = await Level.find({ guildId: interaction.guildId }).select(
      "-_id userId level xp",
    );

    // sort all levels from highest to lowest
    // if two users are on the same level, then compare by xp
    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        return b.xp - a.xp;
      } else {
        return b.level - a.level;
      }
    });

    let currentRank =
      allLevels.findIndex((lvl) => lvl.userId === targetUserId) + 1;

    // generate and send a personalized rank card
    const rank = new RankCardBuilder()
      .setAvatar(
        targetUserObj.user.displayAvatarURL({ format: "png", size: 256 }),
      )
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXp(fetchedLevel.level))
      .setStatus(targetUserObj.presence?.status || "offline")
      .setStyles({
        progressbar: {
          thumb: {
            style: {
              backgroundColor: "#FFC300",
            },
          },
        },
      })
      .setUsername(targetUserObj.user.username)
      .setDisplayName(targetUserObj.user.displayName);

    const data = await rank.build({
      format: "png",
    });
    const attachment = new AttachmentBuilder(data);
    interaction.editReply({ files: [attachment] });
  },

  name: "level",
  description: "Shows your/someone's level.",
  options: [
    {
      name: "target-user",
      description: "The user whose level you want to see.",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
