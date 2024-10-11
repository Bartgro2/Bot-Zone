/*const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Deletes a specific number of messages')
    .addIntegerOption(option => option.setName('amount').setDescription('The amount of messages to delete').setMinValue(1).setMaxValue(100).setRequired(true)),
    async execute(interaction, client) {
        const amount = interaction.options.getInteger('amount');
        const channel = interaction.channel;

        if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({content: 'I do not have permission to delete messages', ephemeral: true}); 
        if (!amount) return await interaction.reply({content: 'Please specify an amount of messages to delete', ephemeral: true})
        if (amount > 100 || amount < 1) return await interaction.reply({content: 'Please select a number between 1 and 100', ephemeral: true});

        await interaction.channel.bulkDelete(amount, true).catch(err => {
            return interaction.reply({content: 'There was an error trying to delete messages in this channel', ephemeral: true});
        });

        const embed = new EmbedBuilder()
        .setColor('Blue')
        .setDescription(`cwhite_check_mark: Deleted **${amount}** messages`);

        await interaction.reply({embeds: [embed]}).catch(err => {
            return;
        });
    }
}
    */