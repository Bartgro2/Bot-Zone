const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction)  => { 
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
      const commandObject = localCommands.find(
        (cmd) => cmd.name === interaction.commandName);
      if (!commandObject) return;

      if(commandObject.devOnly) {
        if(!devs.includes(interaction.member.id)) {
            interaction.reply({
                content: 'Only developers are allowed to run this command.',
                ephemeral: true,
            });
            return;
        }
    }

    if(commandObject.testOnly) {
        if(!(interaction.guild.id === testServer)) {
            interaction.reply({
                content: 'This command cannot be ran here.',
                ephemeral: true,
            });
            return;
        }
      }
    
      if (commandObject.premissionsRequired?.length) {
        for (const premission of commandObject.premissionsRequired) {
            if (!interaction.member.premission.has(premission)) {
                interaction.reply({
                    content: 'Not enough premissions.',
                    ephemeral: true,
                });
                break;
            }
        }
      }
    
      if(commandObject.botPremissions?.length){
        for (const premission of commandObject.botPremissions) {
          const bot = interaction.guild.members.me;

          if (!bot.botPremissions.has(premission))
            interaction.reply({
                content: "I don't have enough premissions.",
                ephemeral: true,
            });
            break;
        }
      }

    await commandObject.callback(client, interaction);
    
    } catch (error) {
      console.log(`There was an error running this command: ${error}`);
        
    }
};