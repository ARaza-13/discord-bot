module.exports = async (client, guildId) => {
  let applicationCommands;

  // if guildId exists, then we get the commands in that specific guild
  if (guildId) {
    const guild = await client.guilds.fetch(guildId);
    applicationCommands = guild.commands;
  } else {
    // bot will fetch the global commands
    applicationCommands = await client.application.commands;
  }

  await applicationCommands.fetch(); // commands need to be fetched at once
  return applicationCommands;
};
