require('dotenv').config();
const { Client, GatewayIntentBits} = require('discord.js');
const eventHandler = require('./handlers/eventHandler');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

eventHandler(client);

client.login(process.env.TOKEN);

/*
client.on('ready', (c) => {
    console.log(`${c.user.tag} is online.`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return; // Handle button interactions specifically

    try {
        await interaction.deferReply({ ephemeral: true });
      
        const role = interaction.guild.roles.cache.get(interaction.customId);
        if (!role) {
            await interaction.editReply("I couldn't find that role");
            return;
        }

        const hasRole = interaction.member.roles.cache.has(role.id);

        if (hasRole) {
            await interaction.member.roles.remove(role); // Remove the role if the user has it
            await interaction.editReply(`The role ${role.name} has been removed.`);
        } else {
            await interaction.member.roles.add(role); // Add the role if the user doesn't have it
            await interaction.editReply(`The role ${role.name} has been added.`);
        }
    } catch (error) {
        console.error('Error handling interaction:', error);
    }
});*/