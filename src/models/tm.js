db = require('./db');
const TMIO = require('trackmania.io'),
    tm = new TMIO.Client();


tm.setUserAgent("confuzed#3037 WR Tracker");
async function getRecord(map, pos) {
    ret = {}

    try {
        // try to get leaderboard entry and return necessary data
        record = await map.leaderboardGet(pos)
        console.log(record)
        player = await record.player()
        ret.date = record.date;
        ret.time = record.time;
        ret.ghost = record.ghost;
        ret.name = player.name

    }
    catch (err) {
        // If record does not exist, return an empty record
        console.log(err)
        ret.date = "";
        ret.time = ""
        ret.name = ""
        ret.ghost = ""
    }

    return ret;

}

async function getMapData(uid) {
    try {
        // Try to get map info and records:
        let map = await tm.maps.get(uid)
        ret = {
            uid: uid,
            guilds: [],
            name: tm.formatTMText(map.name),
            thumbnail: map.thumbnail,
            records: {
                1: {},
                2: {}
            },

        }
        return ret
    }
    catch (err) {
        // If fail just display error message
        return { reply: err }
    }
}

async function addMapToWatchlist(guildId, uid) {

    var maps = db.getCollection("maps");
    let mapInDb = maps.find({ uid: uid })
    console.log(mapInDb)

    if (mapInDb.length > 0) {
        // If map in DB, someone is watching, maybe not this guild
        if (mapInDb[0].guilds.includes(guildId)) {
            // if map is already in guild's watchlist
            ret = mapInDb[0]
            ret.reply = `${ret.name} already in watchlist`
            return ret
        } else {
            // if map is not in guild's watchlist - add guildID to map and update DB
            mapInDb[0].guilds.push(guildId)
            maps.update(mapInDb[0])
            ret = mapInDb[0]
            ret.reply = `${ret.name} added to watchlist`
            return ret
        }
    }
    // Otherwise this is a new map and we should get data :
    let map = await getMapData(uid)

    // if guilds does not exist there was an error, return
    if (!map.guilds) {
        return ret
    }
    
    // added new map successfully, add guildId to map and update DB
    map.guilds.push(guildId)
    maps.insert(map)
    ret.reply = `${ret.name} added to watchlist`
    return ret

}

function removeMap(uid) {
    var maps = db.getCollection("maps");
    maps.remove(uid);
}

module.exports = {
    addMapToWatchlist,
}
