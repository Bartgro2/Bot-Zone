const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const path = require('path');
const { readFileSync } = require('fs');

// Path to your timeouts.json file
const timeoutsFilePath = path.resolve(__dirname, '../config/timeouts.json');

// Load the JSON file
const timeoutsData = JSON.parse(readFileSync(timeoutsFilePath, 'utf8'));

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    // Get the target user's ID
    const targetUserId = interaction.options.get('target-user')?.value || interaction.user.id; // Default to the command user if no target is given

    // Fetch the target user's data from timeouts.json
    const targetUserHistory = timeoutsData.users[targetUserId];

    // If no history is found for this user, inform the moderator
    if (!targetUserHistory) {
      await interaction.reply(`No moderation history found for user <@${targetUserId}>.`);
      return;
    }

    // Create an embed to display the history
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Moderation History for <@${targetUserId}>`)
      .setDescription(`This is the moderation history of the user.`)
      .setTimestamp()
      .setFooter('Moderation History');

    // Add timeout history to the embed
    if (targetUserHistory.timeoutHistory.length > 0) {
      targetUserHistory.timeoutHistory.forEach((timeout, index) => {
        embed.addField(
          `Timeout #${index + 1}`,
          `**Reason:** ${timeout.reason}\n**Duration:** ${timeout.duration} seconds\n**Timestamp:** ${timeout.timestamp}`,
          false
        );
      });
    } else {
      embed.addField('Timeouts', 'No timeouts found in the history.', false);
    }

    // Add other actions (e.g., warnings, kicks, bans) to the embed
    embed.addField('Warnings', targetUserHistory.warnings || 0, true);
    embed.addField('Kicks', targetUserHistory.kicks || 0, true);
    embed.addField('Bans', targetUserHistory.bans || 0, true);

    // Send the embed to the channel
    await interaction.reply({ embeds: [embed] });
  },

  name: 'history',
  description: 'Displays the moderation history of a user.',
  options: [
    {
      name: 'target-user',
      description: 'The user whose moderation history you want to view',
      required: false, // Optional, defaults to the command user if not provided
      type: ApplicationCommandOptionType.Mentionable
    }
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPremissions: [PermissionFlagsBits.SendMessages],
};
