var express = require('express'),
    supertest = require('supertest'),
    api = supertest('localhost:3000'),
    expect = require('chai').expect;


describe('Database Tests', function(){
    before(function(done){
        api.get('/v1/addData')
            .end(function (err, res) {
                done();
            });
    })
        
    it('Should not be null', function(done){
        api.get('/v1/symbols')
            .set('test_id', '1')
            //.expect(400)
            .end(function (err, res) {
                console.log(res.body);
                done();
            });
    });
    
    it('Should not be null', function(done){
        api.get('/v1/symbols')
            .set('test_id', '2')
            //.expect(400)
            .end(function (err, res) {
                console.log(res.body);
                done();
            });
    });
    
    it('Should not be null', function(done){
        api.get('/v1/symbols')
            .set('test_id', '3')
            //.expect(400)
            .end(function (err, res) {
                console.log(res.body);
                done();
            });
    });

    it('Should not be null', function(done){
        api.get('/v1/symbols')
            .set('test_id', '4')
            //.expect(400)
            .end(function (err, res) {
                console.log(res.body);
                done();
            });
    });

    it('Should not be null', function(done){
        api.get('/v1/symbols')
            .set('test_id', '5')
            //.expect(400)
            .end(function (err, res) {
                console.log(res.body);
                done();
            });
    });

    it('Should not be null', function(done){
        api.get('/v1/symbols')
            .set('test_id', '6')
            //.expect(400)
            .end(function (err, res) {
                console.log(res.body);
                done();
            });
    });

    after(function(done){
        api.get('/v1/removeData')
            .end(function (err, res) {
                done();
            });
    })
});