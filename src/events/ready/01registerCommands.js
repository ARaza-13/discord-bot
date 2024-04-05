const { testServer } = require("../../../config.json");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = getApplicationCommands(client, testServer);
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
};
