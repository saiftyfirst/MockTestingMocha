import 'babel-polyfill';
import Mongoose from 'mongoose';
import async from 'async';

const collections = ['test_1', 'test_2', 'test_3', 'test_4' ,'test_5' ,'test_6', 'test_7', 'test_8', 'test_9', 'test_10'];
const schema = new Mongoose.Schema({ name: 'string', size: 'string' });

function customInsertMany(done) {
   async.eachSeries(collections, (element, callback) => {
      let Res = Mongoose.model(element, schema);
      let small = new Res({name: element, size: 'small'});
      small.save(function(err){
         if(err) {
            callback(err)
         }
         else {
            console.log("inserted", element);
            callback()
         }
      });
   }, (err) => {
      if(err) {
        throw err;
      }
      else {
        done();
      }
   });
}

function customDropMany(db){
   collections.forEach(element => {
      db.dropCollection(element);
   });
}

module.exports = {
   populate: function(done) {
      customInsertMany(done);
   },
   unPopulate: function(db){
      customDropMany(db);
   }
};
