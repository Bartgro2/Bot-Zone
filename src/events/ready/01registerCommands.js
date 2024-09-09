const { testServer} = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationsCommands = require('../../utils/getApplicationsCommands');
const getLocalCommands = require('../../utils/getLocalCommands')



module.exports = async (client) => {   
   try {
     const localCommands  = getLocalCommands();
     const applicationsCommands = await getApplicationsCommands(client, testServer)

     for (const localCommand of localCommands ) {
        const { name, description, options } = localCommand;

        const existingCommand = await applicationsCommands.cache.find(
            (cmd) => cmd.name === name
        );

        if (existingCommand) {
            if (localCommand.deleted) {
              await  applicationsCommands.delete(existingCommand.id);
              console.log(`Deleted command "${name}".`);
              continue;
            }

            if(areCommandsDifferent(existingCommand, localCommand)) {
                await applicationsCommands.edit(existingCommand.id, {
                  description,
                  options,
                });

                console.log(`Edited command "${name}"`);
            }
        }   else {
            if (localCommand.deleted) {
               console.log(`Skipping register of this command "${name}" as it's set to delete.`);
               continue;
            }

            await applicationsCommands.create({
              name,
              description,
              options,
            });

            console.log(`registerd command "${name}."`);
        }      
     }
   } catch (error) {
     console.log(`There was an error: ${error}`)
   }
};