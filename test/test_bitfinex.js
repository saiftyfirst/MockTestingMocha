// var express = require('express'),
import 'babel-polyfill';
import Mongoose from 'mongoose';
import chai, {expect} from 'chai';
import Populator from './bitfinexdb_utils/Populator';
import Stomp, { Client, Message } from "stompjs";
import SockJS from "sockjs-client";
import supertest from 'supertest';
import config from 'config';

chai.should();
chai.use(require('chai-like'));
chai.use(require('chai-things')); // Don't swap these t

const api = supertest(config.get('api.endpoint'));

const Schema = Mongoose.Schema;
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

describe('REST API Tests', () => {
   let results = [];
   let auth = {};
   let stompClient;
   before (function(done) {
      this.timeout(5000);
      // Authenticated by the API endpoint
      api.post('/rest/api/v1/auth/login')
         .send({
            "username": config.get('mongodb.username'),
            "password": config.get('mongodb.password')
         }).expect(200).end((err, res) => {
         if (err) {
            done(err);
         } else {
            console.log('API Authenticated');
            auth.token = res.body.access_token;
            // Connect and subscribe to the WebEvent over stomp
            stompClient = Stomp.over(new SockJS(config.get('api.webevent')));
            stompClient.connect({simpUser: auth.token},
               (frame) => {
                  console.log('WebSocket connected');
                  stompClient.subscribe("/user/queue/order", (message) => {
                     let res = JSON.parse(message.body);
                     console.log("WebEvent:", JSON.stringify(res));
                     results.push(res);
                  });
                  // Connect to mongodb
                  Mongoose.connect('mongodb://localhost/' + dbName, options);
                  Mongoose.connection.once('open', () => {
                     console.log("Connected to mongodb");
                     done();
                  }).on('error', () => done(new Error('failed to connect mongodb')));
               },
               (err) => {
                  console.log("Stomp error:", err);
                  done(err);
               }
            );
         }
      });
   });
   after(function(done){
      stompClient.disconnect(()=>{
         Mongoose.connection.db.dropDatabase(function(){
            Mongoose.connection.close(done);
         });
      })
   });

   beforeEach(function(done){
      results = [];
      let model = Mongoose.model('test_' + testCount, testSchema);
      let newObj = new model({ response : data['test_' + testCount++]});
      newObj.save((err) => {
         if(err) {
            done(err)
         } else {
            done();
         }
      });
   });

   it("get user info", function (done) {
      api.get('/rest/api/v1/user')
         .set('Authorization', 'Bearer ' + auth.token)
         .expect("Content-type",/json/).expect(200)
         .end((err, res)=>{
            if ( err ) done(err);
            res.body.should.have.property('clientId');
            res.body.should.have.property('group');
            res.body.should.have.property('userType');
            res.body.should.have.property('accounts');
            done();
         });
   });

   it("post order", function (done) {
      this.timeout(5000);
      api.post('/rest/api/v1/order')
         .set('Authorization', 'Bearer ' + auth.token)
         .set('Content-Type', 'application/json')
         .send({
            "account": "5ab0d86dc08f59b7397c3422",
            "size": 0.0002,
            "actionPrice": 1,
            "actionType": "LIMIT",
            "kind": "order",
            "ticker": "BTCUSD",
            "mic": "ABC",
            "action": "BUY",
            "currency": "USD"
         })
         .expect("Content-type",/json/).expect(200)
         .end((err, res)=>{
            if ( err ) done(err);
            expect(res.body.status).to.equal('Pending_Accepted');
         });
      // retry every 0.5 second till we have 2 events received
      let task = setInterval(()=>{
         if ( 2 === results.length ) {
            clearInterval(task);
            results.should.include.something.that.like({status: "Accepted"});
            results.should.include.something.that.like({status: "Rejected"});
            done();
         }
      }, 500);
   });
});
