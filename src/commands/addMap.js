const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-map')
		.setDescription('Add a map to the watchlist'),
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};