const { Client, Interaction } = require("discord.js");
const User = require("../../models/User");

const dailyAmount = 1000;

module.exports = {
  name: "daily",
  description: "Collect your dailies!",
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

    try {
      await interaction.deferReply();

      const query = {
        userId: interaction.member.id,
        guildId: interaction.guild.id,
      };

      // find the user in the database using the query
      let user = await User.findOne(query);

      // check if the user exists
      // if so, check if their last daily is the same as today
      // if not, craete a new user profile based on the query ids
      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            "You have already collected your dailies today. Come back tomorrow!",
          );
          return;
        }

        user.lastDaily = new Date(); // update user's last daily as the current date
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      // add to the user balance and save to the database
      user.balance += dailyAmount;
      await user.save();

      interaction.editReply(
        `${dailyAmount} was added to your balance. Your new balance is ${user.balance}`,
      );
    } catch (error) {
      consple.log(`Error with /daily: ${error}`);
    }
  },
};
