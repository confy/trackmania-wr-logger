
const loki = require('lokijs');

var db = new loki('database.db', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000 // save every four seconds for our example
});

function databaseInitialize() {
    const collections = ["maps"]
    collections.forEach(function (collectionName) {
        if (!db.getCollection(collectionName)) {
            db.addCollection(collectionName);
        }
    });
}



function addMap(uid) {
    var maps = db.getCollection("maps");
    
    maps.find({name: uid})
}
module.exports = db;