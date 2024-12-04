const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const { writeFileSync } = require('fs');
const path = require('path');

// Path to your timeouts.json file
const timeoutsFilePath = path.resolve(__dirname, '../config/timeouts.json');

// Load the JSON file
const timeoutsData = require(timeoutsFilePath);

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */
  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason = interaction.options.get('reason')?.value || "No reason provided";
    const duration = interaction.options.get('duration')?.value || 60; // Default duration is 60 seconds

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("You can't timeout this user because they are the server owner.");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't timeout this user because they have the same or higher role than you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't timeout this user because they have the same or higher role than me.");
      return;
    }

    // Apply timeout
    try {
      // Timeout the user
      await targetUser.timeout(duration * 1000, reason); // Convert duration to milliseconds

      // Log the timeout action in the JSON
      if (!timeoutsData.users[targetUser.id]) {
        timeoutsData.users[targetUser.id] = {
          warnings: 0,
          timeoutHistory: [],
          kicks: 0,
          bans: 0
        };
      }

      timeoutsData.users[targetUser.id].timeoutHistory.push({
        reason: reason,
        timestamp: new Date().toISOString(),
        duration: duration
      });

      // Save the updated data to the file
      writeFileSync(timeoutsFilePath, JSON.stringify(timeoutsData, null, 2));

      // Send a reply to confirm the timeout
      await interaction.editReply(`User ${targetUser} was timed out for ${duration} seconds.\nReason: ${reason}`);
    } catch (error) {
      console.error(`There was an error when applying the timeout: ${error}`);
      await interaction.editReply("An error occurred while trying to timeout this user.");
    }
  },

  name: 'timeout',
  description: 'Timeout a member from the server for a specified duration',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to timeout',
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    },
    {
      name: 'duration',
      description: 'The duration of the timeout in seconds',
      type: ApplicationCommandOptionType.Integer,
      required: true
    },
    {
      name: 'reason',
      description: 'The reason for the timeout',
      type: ApplicationCommandOptionType.String
    }
  ],
  permissionsRequired: [PermissionFlagsBits.ModerateMembers],
  botPremissions: [PermissionFlagsBits.ModerateMembers],
};
