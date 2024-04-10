const { Client, Message } = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelXp = require("../../utils/calculateLevelXp");

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // generate random number from the min and max values
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  // check if message is actually from within a server or if message author is a bot
  if (!message.inGuild() || message.author.bot) return;

  // define the xp to give to user for their message
  const xpToGive = getRandomXp(5, 15);

  // define query to search database for specific field type
  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    // check the database with the defined query to see if the userId and guildId exist
    const level = await Level.findOne(query);

    // if data exists, edit existing entry by adding the randomly generated xp
    if (level) {
      level.xp += xpToGive;

      // check if current xp is more than the calculated xp required to level up based off user's current level
      // if so, the user will gain +1 level from their current level and their xp will reset
      if (level.xp > calculateLevelXp(level.level)) {
        level.xp = 0;
        level.level += 1;

        message.channel.send(
          `${message.member} you have leveled up to **level ${level.level}**.`,
        );
      }

      // update the database
      await level.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
        return;
      });
    }

    // (!level)
    else {
      // create new level
      const newLevel = new Level({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      await newLevel.save();
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};
