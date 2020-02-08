let restify = require('restify-clients'),
    assert = require('chai').assert,
    async = require('async-seq');

let clientV1 = restify.createJsonClient({
    url: 'http://localhost:3000',
    version: '~1'
});

let clientV2 = restify.createJsonClient({
    url: 'http://localhost:3000',
    version: '~2'
});

async.seq(
    function (callback) {
        // versioned route V1 : get only author ids
        clientV1.get('/api/book/ZT56/author', function (err, req, res, authors) {
            assert.ifError(err);
            //console.log('get %j', authors);
            assert.deepEqual(authors, [{id:1},{id:2}], 'Pb get (test1)');
            callback(null, 'test1');
        })
    },
    function (tst, callback) {
        // versioned route V2 : get all properties of authors
        clientV2.get('/api/book/ZT57/author', function (err, req, res, authors) {
            assert.ifError(err);
            //console.log('get %j', authors);
            assert.deepEqual(authors, [{id:2,firstname:"Paul",lastname:"Martin",books:[{isbn:2}]}], 'Pb get (test2)')
            callback(null, tst + ' ' + 'test2');
        })
    },

)(function (err, results) {
    console.log('Tests %j OK...', results);
});
