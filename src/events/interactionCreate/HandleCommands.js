const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => { 
    if (!interaction.isChatInputCommand()) return;

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find(cmd => cmd.name === interaction.commandName);
        if (!commandObject) return;

        // Developer-only command check
        if (commandObject.devOnly && !devs.includes(interaction.member.id)) {
            await interaction.reply({
                content: 'Only developers are allowed to run this command.',
                ephemeral: true,
            });
            return;
        }

        // Test server check
        if (commandObject.testOnly && interaction.guild.id !== testServer) {
            await interaction.reply({
                content: 'This command cannot be run here.',
                ephemeral: true,
            });
            return;
        }

        // User permissions check
        if (commandObject.permissionsRequired?.length) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    await interaction.reply({
                        content: 'Not enough permissions.',
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        // Bot permissions check
        if (commandObject.botPermissions?.length) {
            const bot = interaction.guild.members.me;

            for (const permission of commandObject.botPermissions) {
                if (!bot.permissions.has(permission)) {
                    await interaction.reply({
                        content: "I don't have enough permissions.",
                        ephemeral: true,
                    });
                    return;
                }
            }
        }

        // Execute the command
        if (typeof commandObject.execute === 'function') {
            await commandObject.execute(interaction);
        } else if (typeof commandObject.callback === 'function') {
            await commandObject.callback(client, interaction);
        }

    } catch (error) {
        console.log(`There was an error running this command: ${error}`);
    }
};
