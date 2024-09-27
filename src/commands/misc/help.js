const { EmbedBuilder } = require('discord.js');
const embedData = require('../../jsons/embeds.json'); 

module.exports = {
    name: 'help',
    description: 'Provides help information about the bot commands',
    async execute(interaction) {
        try {
            const data = embedData.help; 

            const embed = new EmbedBuilder()
                .setTitle(data.title)
                .setDescription(data.description)
                .setColor(data.color) 
                .addFields(data.fields); 

            // Send the embed in the channel, below the original interaction
            await interaction.channel.send({ embeds: [embed] });

            // Reply to the interaction as ephemeral
            await interaction.reply({ content: 'Here are the available commands:', ephemeral: true });
        } catch (error) {
            console.error('Error executing help command:', error);
            await interaction.reply({ content: 'There was an error trying to execute that command!', ephemeral: true });
        }
    }
};


