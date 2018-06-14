// var express = require('express'),
//     supertest = require('supertest'),
//     api = supertest('localhost:3000'),
//     expect = require('chai').expect;
import 'babel-polyfill';
import Mongoose from 'mongoose';
import chai from 'chai';
import Populator from './bitfinexdb_utils/Populator';
const Schema = Mongoose.Schema;
const expect = chai.expect;
const dbName = 'response_db';
const data = require('./bitfinexdb_utils/data.json');

const options = {
   autoIndex: false, // Don't build indexes
   reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
   reconnectInterval: 500, // Reconnect every 500ms
   poolSize: 10, // Maintain up to 10 socket connections
   // If not connected, return errors immediately rather than waiting for reconnect
   bufferMaxEntries: 0
};

let testCount = 1 ;
let testSchema = new Mongoose.Schema({ response : Object});

describe('Database Tests', () => {

    before(function(done){
        Mongoose.connect('mongodb://localhost/' + dbName, options);
        Mongoose.connection.once('open', () => {
            console.log("Connected to db");
            done();
        }).on('error', () => console.log("Error"));
    })

    beforeEach(function(done){
        let model = Mongoose.model('test_' + testCount, testSchema);
        let newObj = new model({ response : data['test_' + testCount++]});
        newObj.save((err) => {
            if(err) console.log(err);
            done();
        });
    })

    it("test1", function () {
      console.log("top test1");

    });
    
    it("test2", function () {
        console.log("top test1");
    });
    
    it("test3", function () {
        console.log("top test1");
    });
    
    it("test4", function () {
        console.log("top test1");
    });
    
    it("test5", function () {
        console.log("top test1");
    });

    it("test6", function () {
        console.log("top test1");
    });
    
    // it('Should not be null', (done) => {
        // api.get('/v1/symbols')
        //     .set('test_id', '1')
        //     //.expect(400)
        //     .end(function (err, res) {
        //         console.log(res.body);
        //         done();
        //     });
    // });

    // it('Should not be null', function(done){
    //     api.get('/v1/symbols')
    //         .set('test_id', '2')
    //         //.expect(400)
    //         .end(function (err, res) {
    //             console.log(res.body);
    //             done();
    //         });
    // });
    //
    // it('Should not be null', function(done){
    //     api.get('/v1/symbols')
    //         .set('test_id', '3')
    //         //.expect(400)
    //         .end(function (err, res) {
    //             console.log(res.body);
    //             done();
    //         });
    // });
    //
    // it('Should not be null', function(done){
    //     api.get('/v1/symbols')
    //         .set('test_id', '4')
    //         //.expect(400)
    //         .end(function (err, res) {
    //             console.log(res.body);
    //             done();
    //         });
    // });
    //
    // it('Should not be null', function(done){
    //     api.get('/v1/symbols')
    //         .set('test_id', '5')
    //         //.expect(400)
    //         .end(function (err, res) {
    //             console.log(res.body);
    //             done();
    //         });
    // });
    //
    // it('Should not be null', function(done){
    //     api.get('/v1/symbols')
    //         .set('test_id', '6')
    //         //.expect(400)
    //         .end(function (err, res) {
    //             console.log(res.body);
    //             done();
    //         });
    // });

    // after(function(done){
    //     Mongoose.connection.db.dropDatabase(function(){
    //        Mongoose.connection.close(done);
    //     });
    // })
});
