const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const cron = require('cron');
const discord = require('discord.js');
require('dotenv').config()

const db = require('./models/db')
const tm = require('./models/tm')
const user = require('./models/user')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    client.user.setActivity("🇨🇦", { type: "WATCHING"})
    console.log('Ready!');
});


client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);

// Check for new WRs every 10 minutes (1 for tests)
// const test = new cron.CronJob("0 */1 * * * *", () =>{
//     console.log("Checking WRs");    
//     client.channels.fetch('858470809143607307')
//     .then(channel => channel.send("Checking WRs..."));
    
//     tm.addMap('JPZz7UXg5Y2K0VpsyUNgCMP0yH8')
    
// });

// test.start()


