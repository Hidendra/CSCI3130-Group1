/**
 * The module that handles storing and creating new sessions
 *
 * @module Session
 */

var crypto = require('crypto');

module.exports = function (db) {
	var sessions = db.get('sessions');

	/**
	 * Class used for handling and creating new user sessions
	 *
	 * @class Session
	 */
	return {
		/**
		 * Finds a session in the database, which will call the callback
		 * with the found user's id (or null if not found)
		 *
		 * @method findSession
		 * @param sessionKey the key to find a session for
		 * @param callback the function to call with the session user's ID (or null if not found)
		 */
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

		/**
		 * Create a new session for the given user
		 *
		 * @method createSession
		 * @param userid the user to create a session for
		 * @return {String} the generated session key
		 */
		createSession: function (userid) {
			var key = generateKey();

			// insert the new session
			sessions.insert({
				userid: userid,
				key: key
			});

			return key;
		}
	}
}

/**
 * Generate a random session key
 *
 * @method generateKey
 * @return {String} the generated key
 */
var generateKey = function () {
	var sha = crypto.createHash('sha256');
	sha.update(Math.random().toString());
	return sha.digest('hex');
};