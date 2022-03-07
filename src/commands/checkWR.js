const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('check-wr')
		.setDescription('Check a WR on a map by uid or name'),
	async execute(interaction) {
		return interaction.reply('Pong!');
	},
};