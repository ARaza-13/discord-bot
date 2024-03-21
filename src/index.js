import "./style.css";

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

client.login(
  "MTIyMDQ1NjExNjQyNTcyMzkzNA.GnBzbD.GeebcYnow3cYEnS24Jx18SXd9jbdUOwdn5lShg",
);
