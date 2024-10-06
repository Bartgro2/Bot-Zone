const fs = require('fs').promises;
const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const kickCommand = require('./kick.js'); // Import the kick command
const banCommand = require('./ban.js'); // Import the ban command
const ActionData = require('../../jsons/moderation-actions.json'); // Load moderation actions from JSON

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;
    const reason = interaction.options.get('reason')?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("You can't warn this user because they are the server owner.");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't warn this user because they have the same or a higher role than you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't warn this user because they have the same or a higher role than me.");
      return;
    }

    // Load warnings from the file
    let warnings;
    try {
      const data = await fs.readFile('./warnings.json', 'utf-8');
      warnings = JSON.parse(data);
    } catch (error) {
      warnings = {}; // If file doesn't exist or error occurs, initialize an empty object
    }

    // Initialize warnings if they don't exist for this user
    if (!warnings[targetUserId]) {
      warnings[targetUserId] = { count: 0, reasons: [] };
    }

    // Add the warning to the count and store the reason
    warnings[targetUserId].count += 1;
    warnings[targetUserId].reasons.push({
      reason: reason,
      date: new Date().toISOString(), // Store the date in ISO format
    });

    // Save the updated warnings back to the file
    await fs.writeFile('./warnings.json', JSON.stringify(warnings, null, 2));

    // Reply with a warning count
    await interaction.editReply(`User ${targetUser} has been warned.\nTotal warnings: ${warnings[targetUserId].count}`);

    // Kick or ban logic based on warning count
    if (warnings[targetUserId].count === 2) {
      await interaction.followUp(`User ${targetUser} is being kicked for reaching 2 warnings.`);
      await kickCommand.callback(client, interaction, targetUserId);
    } else if (warnings[targetUserId].count >= 3) {
      await interaction.followUp(`User ${targetUser} is being banned for reaching 3 warnings.`);
      await banCommand.callback(client, interaction, targetUserId);
    }
  },

  name: 'warn',
  description: 'Warns a member of the server',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to warn',
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: 'reason',
      description: 'The reason for the warning',
      type: ApplicationCommandOptionType.String,
      choices: Object.keys(ActionData.reasons)
        .filter(reason => ActionData.reasons[reason].applicableActions.includes('warn'))
        .map(reason => ({ name: reason, value: reason })),
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers],
};

