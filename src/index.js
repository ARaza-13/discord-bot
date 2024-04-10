require("dotenv").config(); // access the token from .env file
const { Client, IntentsBitField } = require("discord.js");
const mongoose = require("mongoose");
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

// connect to database
(async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");

    eventHandler(client);

    client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
