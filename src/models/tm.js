require('./db');
const TMIO = require('trackmania.io'),
    tm = new TMIO.Client();


function addMap(uid) {
    var maps = db.getCollection("maps");
    maps.insert({
        name: uid
    });
}
function getMap(uid) {
    tm.maps.get(uid).then(map => {
        const mapName = tm.formatTMText(map.name);

        console.log(mapName);
    });

}

module.exports = {
    getMap,
}
