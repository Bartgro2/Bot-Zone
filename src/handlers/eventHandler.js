const path = require('path');
const getallFiles = require('../utils/getallFiles');

module.exports = (client)  => {
   const eventsFolders = getallFiles(path.join(__dirname, '..', 'events'), true);

   for (const eventsFolder of eventsFolders) {
      const eventFiles = getallFiles(eventsFolder);
      eventFiles.sort((a,b) => a > b)
      console.log(eventFiles);
      
      const eventName = eventsFolder.replace(/\\/g, '/').split('/').pop();
      
      client.on(eventName, async (arg) => {
        for( const eventFile of eventFiles) {
            const eventFunction = require(eventFile);
            await eventFunction(client, arg)
        }
      }) 
   }
};
