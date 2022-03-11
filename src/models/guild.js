db = require('./db');

function checkForGuildData(guildId) {
    console.log("Checking for guild data...")
    var guilds = db.getCollection("guilds");
    let guildInDb = guilds.find({ guildId: guildId })
    if (guildInDb.length == 0) {
        console.log("No guild data found")
        return false
    } else {
        console.log("Found guild data")
        return true
    }
}

function addChannelIdToGuild(guildId, channelId) {
    console.log("Adding channel to guild...")
    var guilds = db.getCollection("guilds");
    let guildInDb = guilds.find({ guildId: guildId })
    if (guildInDb.length == 0) {
        console.log("No guild data found")
        guilds.insert({ guildId: guildId, channelId: channelId })
    } else {
        console.log("Found guild data")
        guildInDb[0].channelId = channelId
        guilds.update(guildInDb[0])
    }
}

module.exports = {
    checkForGuildData, addChannelIdToGuild
}