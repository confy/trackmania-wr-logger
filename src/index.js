const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const cron = require('cron');
const discord = require('discord.js');
require('dotenv').config()

const db = require('./models/db')
const tm = require('./models/tm')
const user = require('./models/guild')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    client.user.setActivity("🇨🇦", { type: "WATCHING" })
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

const test = new cron.CronJob("0 */1 * * * *", () => {
    let guilds = db.getCollection("guilds")
    let maps = db.getCollection("maps")
    let mapsArray = db.getCollection("maps").find()
    for (let i = 0; i < mapsArray.length; i++) {
        // iterate through each map in the db
        let map = mapsArray[i];

        console.log(map)
        tm.checkRecord(map.uid).then(async (Map) => {
            map = Map
        })
        console.log(map)

        if (map.notifiedDiscord == false) {
            // if discord has not been notified, there is a new record
            for (let j = 0; j < map.guilds.length; j++) {
                // iterate through each guild that is watching this map
                let guild = guilds.find({ guildId: map.guilds[j] })
                // then, find the corresponding channel ID in the guilds DB
                if (guild.length > 0) {
                    let channel = client.channels.cache.get(guild[0].channelId)
                    if (channel) {
                        channel.send(`${map.name} has a new record!`)
                    }
                }
            }
            map.notifiedDiscord = true   
        }
        maps.update(map)
    }
});

test.start()


