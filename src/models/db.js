
const loki = require('lokijs');

var db = new loki('database.db', {
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000 // save every four seconds for our example
});

function databaseInitialize() {
    const collections = ["maps"];
    collections.forEach(function (collectionName) {
        if (!db.getCollection(collectionName)) {
            db.addCollection(collectionName);
        }
    });
}

module.exports = db;