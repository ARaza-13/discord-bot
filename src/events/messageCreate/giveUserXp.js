const { Client, Message } = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // generate random number from the min and max values
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// import Client and Interaction intellisense from discord.js
/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  // check if message is actually from within a server, if message author is a bot, or if message author is on cooldown
  if (
    !message.inGuild() ||
    message.author.bot ||
    cooldowns.has(message.author.id)
  )
    return;

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
      // give user 30s cooldown
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 30000);
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
      // give user 30s cooldown
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 30000);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};
