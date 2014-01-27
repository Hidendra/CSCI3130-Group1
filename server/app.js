var express = require('express');
var app = express();

// connect to Mongo
var db = require('monk')('127.0.0.1:27017/group1');
var testcollection = db.get('testcollection');

app.get('/', function(req, res) {
    res.send('Hello World');
});

app.get('/test/:x', function(req, res) {
    res.send('test: ' + req.params.x);
});

app.get('/find', function(req, res) {
    testcollection.find({}, function(err, docs) {
        res.json(docs);
    });
});

app.get('/insert/:name', function(req, res) {
    testcollection.insert({
        name: req.params.name
    });

    console.log("Inserted: " + req.params.name);
    res.json({status: 'ok'});
});

app.get('/remove/:name', function(req, res) {
    testcollection.remove({
        name: req.params.name
    });

    console.log("Removed: " + req.params.name);
    res.json({status: 'ok'});
});

app.listen(8001);

console.log('Server running at http://127.0.0.1:8001/');