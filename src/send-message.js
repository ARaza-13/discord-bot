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

const roles = [
  {
    id: "1221912825144938598",
    label: "Red",
  },
  {
    id: "1221927998693838868",
    label: "Blue",
  },
  {
    id: "1221928510562631710",
    label: "Green",
  },
];

// listens when the bot is ready
client.on("ready", (c) => {
  console.log(`✅ ${c.user.tag} is online.`);
});

client.login(process.env.TOKEN);
