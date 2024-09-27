const path = require('path');
const getallFiles = require('./getAllFiles');
const consoleLog = require('../events/ready/consoleLog');

module.exports = (exceptions = []) => {
  let localCommands = [];

  const commandsCategories = getallFiles(
    path.join(__dirname, '..', 'commands'),
    true
  );

  for (const commandsCategory of commandsCategories) {
    const commandFiles = getallFiles(commandsCategory);

    for( const commandFile of commandFiles) {
        const commandObject = require(commandFile);

        if(exceptions.includes(commandObject.name)) {
          continue;
        }
        console.log(commandObject);
        localCommands.push(commandObject);
    }
  }

  return localCommands;
}