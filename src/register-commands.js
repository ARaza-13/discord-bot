require("dotenv").config(); // access bot and server ID from .env file
const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "hey",
    description: "Replies with hey!",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// Register slash commands
(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log("Slash commands were registered successfully");
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();
