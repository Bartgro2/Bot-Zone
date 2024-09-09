/*require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const roles = [
    {
        id: '1280869417131180053',
        label: 'Blik',
    },
    {
        id: '1196768394192638063',
        label: 'Verified',
    }
];

client.on('ready', async (c) => {
    try {
        // Fetch the channel to ensure it's correctly retrieved
        const channel = await client.channels.fetch('1196773841884688434'); 
        if (!channel) return;

        // Create an ActionRowBuilder instance
        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(role.id)
                    .setLabel(role.label)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        // Send the message with buttons
        await channel.send({
            content: 'Claim or remove a role below.',
            components: [row],
        });

    } catch (error) {
        console.error('Error sending message with buttons:', error);
    }
});

client.login(process.env.TOKEN);
*/