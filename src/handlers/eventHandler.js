const path = require("path");
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {
  // import list of folders only from inside the events directory
  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  // import all the files inside of each respective event folder
  for (const eventFolder of eventFolders) {
    const eventFiles = getAllFiles(eventFolder);

    // get the name of the event based on the folder name
    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop(); // gets the last array element, which will be the folder name

    // add an event listener and pass in all the event files
    // loop through all eventFiles and extract the function from each file
    client.on(eventName, async (arg) => {
      for (const eventFile of eventFiles) {
        const eventFunction = require(eventFile);
        await eventFunction(client, arg);
      }
    });
  }
};
