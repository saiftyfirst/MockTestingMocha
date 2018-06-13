var MongoClient = require('mongodb').MongoClient;
var data = require('./data.json');
let client;

var collections = ['test_1', 'test_2', 'test_3', 'test_4' ,'test_5' ,'test_6'];

function customInsertMany(db){
    collections.forEach(element => {
        db.collection(element).insert(data[element], {ordered: false});
        //console.log("Pika");
    });
    //db.collection(collection).insert(data[collection]);
}

function customDropMany(db){
    collections.forEach(element => {
        db.dropCollection(element);
    });
}

module.exports = {
    populate: function(db) {  
        customInsertMany(db);    
    },
    unPopulate: function(db){
        customDropMany(db);
    }
};
