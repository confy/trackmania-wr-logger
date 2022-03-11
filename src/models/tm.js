db = require('./db');
const TMIO = require('trackmania.io'),
    tm = new TMIO.Client();


tm.setUserAgent("confuzed#3037 WR Tracker");

async function getRecord(map, pos) {
    ret = {}

    try {
        // try to get leaderboard entry and return necessary data
        record = await map.leaderboardGet(pos)
        player = await record.player()
        ret.date = record.date;
        ret.time = record.time;
        ret.ghost = record.ghost;
        ret.name = player.name
        console.log(ret)

    }
    catch (err) {
        // If record does not exist, return an empty record
        console.log(err)
        ret.date = "";
        ret.time = 0
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
            notifiedDiscord: false,
            record: {
                date: "",
                name: "", 
                ghost: "", 
                time: 0
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
    if (!map.guilds) { return map }

    // added new map successfully, add guildId to map and update DB
    map.guilds.push(guildId)
    maps.insert(map)
    ret.reply = `${ret.name} added to watchlist`
    return ret

}

async function checkRecord(uid) {
    let maps = db.getCollection("maps");
    let map = maps.find({ uid: uid })
    if (map.length > 0) {
        map = map[0]
        mapObj = await tm.maps.get(uid)
        let newRecord = await getRecord(mapObj, 1)
        if (newRecord.time != map.record.time) {
            map.record = newRecord
            map.notifiedDiscord = false
            maps.update(map)
        }
        return map
    } else {
        console.log("No map with uid: " + uid)
    }
}

function removeMap(uid) {
    var maps = db.getCollection("maps");
    maps.remove(uid);
}

module.exports = {
    addMapToWatchlist, checkRecord
}
