var express = require('express');
var app = express();

app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/test/:x', function(req, res){
    res.send('test: ' + req.params.x);
});

app.listen(8001);

console.log('Server running at http://127.0.0.1:8001/');