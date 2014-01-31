var express = require('express');
var sha1 = require('sha1');
var app = express();
app.use(express.bodyParser());

// connect to Mongo
var db = require('monk')('127.0.0.1:27017/group1');
var users = db.get('users');

// Get a listing of all users
app.get('/user', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	users.find({}, function (err, docs) {
		res.json(docs);
	});
});

// Verify a user's credentials
app.post('/user/:username', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	users.find({
		username: req.params.username
	}, function (err, docs) {
		if (docs.length == 0) {
			res.send(404);
		} else {
			var user = docs[0];
			if (sha1(req.body.password) == user.password) {
				res.json(user);
			} else {
				res.send(403);
			}
		}
	});
});

// Create a user
app.post('/user', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');

	var username = req.body.username;

	// check that the users did not
	users.find({
		username: username
	}, function (err, docs) {
		if (docs.length != 0) {
			res.send(403);
			return;
		}

		users.insert({
			username: username,
			password: sha1(req.body.password)
		});

		// output the user back to the client
		users.find({
			username: username
		}, function (err, docs) {
			res.json(docs);
		});
	});
});

app.listen(8001);

console.log('Server running at http://127.0.0.1:8001/');
