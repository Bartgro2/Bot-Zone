module.exports = async (client, guildId) => {
    let applicationCommands;
  
    if (guildId) {
      const guild = await client.guilds.fetch(guildId); // Corrected to client.guilds
      applicationCommands = guild.commands;  // Corrected to guild.commands
    } else {
      applicationCommands = client.application.commands;
    }
  
    await applicationCommands.fetch();
    return applicationCommands;
  }
  