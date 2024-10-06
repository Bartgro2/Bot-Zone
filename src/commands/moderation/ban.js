const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');
const ActionData = require('../../jsons/moderation-actions.json'); // Load moderation actions from JSON

module.exports = {
  /**
   * 
   * @param {Client} client 
   * @param {Interaction} interaction 
   */

  callback: async (client, interaction) => {
    const targetUserId = interaction.options.get('target-user').value;

    // Attempt to get the custom reason; if none, default to "No reason provided"
    const customReason = interaction.options.get('reason')?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("You can't ban this user because they are the server owner.");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; // Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // Highest role of the user running the command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply("You can't ban this user because they have the same or a higher role than you.");
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply("I can't ban this user because they have the same or a higher role than me.");
      return;
    }

    // Determine the reason to be used for banning
    let reason = customReason;

    if (ActionData.reasons[customReason] && ActionData.reasons[customReason].applicableActions.includes('ban')) {
      reason = ActionData.reasons[customReason].description; // Use predefined reason if provided and applicable to ban
    } else {
      reason = "Custom Reason: " + customReason; // Label as custom if not in predefined reasons or not applicable to ban
    }

    // Ban the target user
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(`User ${targetUser} was banned.\nReason: ${reason}`);
    } catch (error) {
      console.log(`There was an error when banning: ${error}`);
      await interaction.editReply("An error occurred while trying to ban the user.");
    }
  },

  name: 'ban',
  description: 'Bans a member from the server',
  options: [
    {
      name: 'target-user',
      description: 'The user you want to ban',
      required: true,
      type: ApplicationCommandOptionType.Mentionable
    },
    {
      name: 'reason',
      description: 'The reason for banning',
      type: ApplicationCommandOptionType.String,
      choices: Object.keys(ActionData.reasons)
        .filter(reason => ActionData.reasons[reason].applicableActions.includes('ban'))
        .map(reason => ({ name: reason, value: reason })),
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
