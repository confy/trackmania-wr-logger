
const tm = require('../models/tm');

const { SlashCommandBuilder } = require('@discordjs/builders');
function convertToText(obj) {
    //create an array that will later be joined into a string.
    var string = [];

    //is object
    //    Both arrays and objects seem to return "object"
    //    when typeof(obj) is applied to them. So instead
    //    I am checking to see if they have the property
    //    join, which normal objects don't have but
    //    arrays do.
    if (typeof(obj) == "object" && (obj.join == undefined)) {
        string.push("{");
        for (prop in obj) {
            string.push(prop, ": ", convertToText(obj[prop]), ",");
        };
        string.push("}");

    //is array
    } else if (typeof(obj) == "object" && !(obj.join == undefined)) {
        string.push("[")
        for(prop in obj) {
            string.push(convertToText(obj[prop]), ",");
        }
        string.push("]")

    //is function
    } else if (typeof(obj) == "function") {
        string.push(obj.toString())

    //all other values can be done with JSON.stringify
    } else {
        string.push(JSON.stringify(obj))
    }

    return string.join("")
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('add-map')
		.setDescription('Add a map to the watchlist')
		.addStringOption(option =>
			option.setName('uid')
				.setDescription('The map uid to add')
				.setRequired(true)),
	async execute(interaction) {
        uid = interaction.options.getString('uid')
        console.log(uid)
		const map = await tm.addMapToWatchlist(interaction.guild.id, uid)

		return interaction.reply({ content: convertToText(map)});
	},
};