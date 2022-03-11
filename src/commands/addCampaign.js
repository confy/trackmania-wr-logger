const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-campaign')
		.setDescription('Adds a campaign to the watchlist'),
	async execute(interaction) {
		console.log(interaction)
		return interaction.reply('Pong!');
	},
};