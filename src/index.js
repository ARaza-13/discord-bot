require("dotenv").config(); // access the token from .env file
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");

// create a bot instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers, // bot will have access to members inside the server
    IntentsBitField.Flags.GuildMessages, // bot will access to messages inside the server
    IntentsBitField.Flags.MessageContent, // bot will be able to read messages inside the server
  ],
});

// listens when the bot is ready
client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
});

// triggers even listener whenever new message is sent that the bot can see
client.on("messageCreate", (message) => {
  // exit out event listener if read message is from a bot
  if (message.author.bot) {
    return;
  }

  if (message.content.toLowerCase() === "hello") {
    message.reply("hello");
  }
});

// listens to interaction event listeners whenever a slash command is ran
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return; // if interaction is not a slash command, exit the function

  // slash command: hey
  if (interaction.commandName === "hey") {
    interaction.reply("hey!");
  }

  // slash command: say my name
  if (interaction.commandName === "say-my-name") {
    interaction.reply("you're Heisenberg");
  }

  // slash command: emded
  if (interaction.commandName === "embed") {
    const embed = new EmbedBuilder()
      .setTitle("Embed Title")
      .setDescription("This is an embed description")
      .setColor("Random")
      .addFields(
        {
          name: "Field Title",
          value: "Some random value",
          inline: true,
        },
        {
          name: "2nd Field Title",
          value: "Some random value",
          inline: true,
        },
      );

    interaction.reply({ embeds: [embed] });
  }

  // slash command: add
  if (interaction.commandName === "add") {
    const num1 = interaction.options.get("first-number").value;
    const num2 = interaction.options.get("second-number").value;

    interaction.reply(`The sum is ${num1 + num2}`);
  }

  // button command: claim/drop roles
  if (interaction.isButton()) {
    await interaction.deferReply({ emphemeral: true }); // give user the message that the bot is thinking

    const role = interaction.guild.roles.cache.get(interaction.customId);
    // check to see if role exists
    if (!role) {
      interaction.editReply({
        content: "I couldn't find that role.",
      });
      return;
    }
  }
});

client.login(process.env.TOKEN);
