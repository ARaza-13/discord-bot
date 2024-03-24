require("dotenv").config(); // access the token from .env file
const { Client, IntentsBitField } = require("discord.js");

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

client.on("interactionCreate", (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "hey") {
    interaction.reply("hey!");
  }

  if (interaction.commandName === "say_my_name") {
    interaction.reply("you're Heisenberg");
  }
});

client.login(process.env.TOKEN);
