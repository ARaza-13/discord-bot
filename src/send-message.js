require("dotenv").config(); // access the token from .env file
const {
  Client,
  IntentsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

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

// send the message with the button roles when the bot comes online
client.on("ready", async (c) => {
  try {
    const channel = await client.channels.cache.get("1221912016265019502");
    if (!channel) return;

    const row = new ActionRowBuilder();

    roles.forEach((role) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Primary),
      );
    });
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.TOKEN);
