require("dotenv").config(); // access the token from .env file
const { Client, IntentsBitField } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");

// create a bot instance
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers, // bot will have access to members inside the server
    IntentsBitField.Flags.GuildMessages, // bot will access to messages inside the server
    IntentsBitField.Flags.MessageContent, // bot will be able to read messages inside the server
  ],
});

eventHandler(client);

client.login(process.env.TOKEN);
