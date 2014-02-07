var crypto = require('crypto');

module.exports = function (db) {
	var sessions = db.get('sessions');

	return {
		// Finds a session and returns the user it is for, otherwise null.
		findSession: function (sessionKey, callback) {
			sessions.findOne({
				key: sessionKey
			}, function (err, docs) {
				if (docs == null) {
					callback(null);
				} else {
					callback(docs.userid);
				}
			});
		},

		// Creates a new session and returns the session id
		createSession: function (userid) {
			var key = generateKey();

			// expire any older sessions for the user
			sessions.remove({
				userid: userid
			});

			// insert the new session
			sessions.insert({
				userid: userid,
				key: key
			});

			return key;
		}
	}
}

// Generate a session key
var generateKey = function () {
	var sha = crypto.createHash('sha256');
	sha.update(Math.random().toString());
	return sha.digest('hex');
};