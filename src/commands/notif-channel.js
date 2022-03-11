const { SlashCommandBuilder } = require('@discordjs/builders');
const guild = require('../models/guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('notif-channel')
        .setDescription('Modify the discord channel used for WR notifications')
        .addStringOption(option =>
            option.setName('id')
                .setDescription('The discord channel ID')
                .setRequired(true)),
    async execute(interaction) {
        channelId = interaction.options.getString('id')
        console.log(`adding channel ID: ${channelId} to ${interaction.guild.id}`)
        guild.addChannelIdToGuild(interaction.guild.id, channelId)
        return interaction.reply({ content: `adding channel ID: ${channelId} to ${interaction.guild.id}` });
    },
};