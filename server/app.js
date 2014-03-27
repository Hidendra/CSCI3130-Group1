/**
 * The main app module for HotSpot. This is ran by nodejs.
 *
 * @module HotSpot
 * @main HotSpot
 */

var express = require('express');
var sha1 = require('sha1');
var app = express();
app.use(express.bodyParser());

// math
var math = require('./math')();

// connect to Mongo
var db = require('monk')('127.0.0.1:27017/group1');
var users = db.get('users');
var points = db.get('points');
var places = db.get('places');


// Session handler
var session = require('./session')(db);

// Get a listing of all users
app.get('/user', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	users.find({}, function (err, docs) {
		res.json(docs);
	});
});

// Login a user
app.post('/user/:username', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	users.find({
		username: req.params.username
	}, function (err, docs) {
		if (docs.length == 0) {
			res.send(404);
		} else {
			var user = docs[0];
			var key = session.createSession(user._id);

			console.log('User ' + user.username + ' authenticated. Session id: ' + key);

			if (sha1(req.body.password) == user.password) {
				res.json({
					key: key
				});
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
			var user = docs[0];
			var key = session.createSession(user._id);

			console.log('User ' + user.username + ' authenticated. Session id: ' + key);

			res.json({
				key: key
			});
		});
	});
});

// Checks if a user exists
app.post('/checkuser', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');

	var username = req.body.username;

	// check that the users did not
	users.find({
		username: username
	}, function (err, docs) {
		if (docs.length != 0) {
			res.send(403);
			return;
		} else {
			res.json({});
		}
	});
});

app.post('/position', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');

	session.findSession(req.body.key, function(userid) {
		if (userid == null){
			res.send(403);
			return;
		}

		var requestLat = req.body.lat;
		var requestLon = req.body.lon;

		// find their last position - if they had a last position then check that it was not too
		// close to where they are currently
		points.find({
			userid: userid
		}, {
			limit: 1,
			sort: {
				time: -1
			}
		}, function (err, docs) {

			if (docs.length != 0) {
				var point = docs[0];

				var dist = Math.abs(math.geodist(parseFloat(requestLat), parseFloat(requestLon), parseFloat(point.lat), parseFloat(point.lon)));
				console.log("Point received; distance to last point = " + dist + "m");

				if (dist > 10 && dist < 20) {
					requestLat = point.lat;
					requestLon = point.lon;
				}
			}

			points.insert({
				userid: userid,
				lat: parseFloat(requestLat),
				lon: parseFloat(requestLon),
				time: parseInt(new Date().getTime() / 1000)
			});

		});
	});
});

app.post('/places', function (req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    session.findSession(req.body.key, function(userid) {
        if (userid == null){
            res.send(403);
            return;
        }

        var requestPlaceName = req.body.placeName;
        var requestLat = req.body.lat;
        var requestLon = req.body.lon;


        // find their last position - if they had a last position then check that it was not too
        // close to where they are currently


        places.update(
            { user: userid },
            { $push: { places: { name: requestPlaceName,
                        lat: parseFloat(requestLat),
                        lon: parseFloat(requestLon)
            }}},{ upsert: true}
        );


    });
});

app.get('/points/:key', function (req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');

	session.findSession(req.params.key, function (userid) {
		if (userid == null) {
			res.send(403);
			return;
		}

		// just view points for the last 24 hours for now
		var minTime = parseInt(new Date().getTime() / 1000) - 86400;

		points.find({
			userid: userid,
			time: {
				$gte: minTime
			}
		}, 'lat lon time -_id', function (err, docs) {
			res.json(docs);
		});
	});
});

app.listen(8001);

console.log('Server running at http://127.0.0.1:8001/');
