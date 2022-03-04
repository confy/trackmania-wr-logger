const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const cron = require('cron');
const discord = require('discord.js');
require('dotenv').config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('Ready!');
});

const test = new cron.CronJob("0 */1 * * * *", () =>{
    console.log("Test");
    client.channels.fetch("858470809143607307")
    let testmsg = client.channels.cache.get("858470809143607307")
    testmsg.send("test")
});

test.start()

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

