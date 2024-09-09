require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
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
});

client.login(process.env.TOKEN);

/*

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return; // Check for isCommand() instead of isChatInputCommand()

    // Define the help embed
    const helpEmbed = new EmbedBuilder()
        .setTitle('Help Command')
        .setDescription('Here is some help information about the bot.')
        .setColor('Blue') // You can use a color code or 'Blue'
        .addFields(
            { name: 'help', value: 'The help command', inline: true },
            { name: 'info', value: 'Gives information about the bot', inline: true }
        );

    // Define the info embed with footer, author, and timestamp
    const infoEmbed = new EmbedBuilder()
        .setTitle('Bot Info')
        .setDescription('Here is some general information about the bot.')
        .setColor('Green') // You can use a color code or 'Green'
        .addFields(
            { name: 'Info 1', value: 'Details about Info 1', inline: true },
            { name: 'Info 2', value: 'Details about Info 2', inline: true }
        )
        .setFooter({ text: 'Footer Text Here' }) // Customize footer text
        .setAuthor({ name: 'AkiraEnishi', iconURL: 'https://example.com/icon.png' }) // Customize author with name and icon URL
        .setTimestamp(); // Add timestamp to the embed

    // Handle the 'help' command
    if (interaction.commandName === 'help') {
        await interaction.reply({ content: 'Processing your request...', ephemeral: true });

        // Send the help embed to the channel
        await interaction.channel.send({ embeds: [helpEmbed] });

        // Optionally delete the ephemeral reply if you don't want it to be seen
        await interaction.deleteReply();
    } 
    // Handle the 'info' command
    else if (interaction.commandName === 'info') {
        await interaction.reply({ content: 'Processing your request...', ephemeral: true });

        // Send the info embed to the channel
        await interaction.channel.send({ embeds: [infoEmbed] });

        // Optionally delete the ephemeral reply if you don't want it to be seen
        await interaction.deleteReply();
    }
});
*/




