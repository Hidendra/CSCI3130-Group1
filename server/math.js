/**
 * Useful math functions related to geopositioning
 *
 * @module Math
 */

// Add toRad if it does not already exist in Number.
// This converts degrees to radians
if (typeof(Number.prototype.toRad) === "undefined") {
	Number.prototype.toRad = function() {
		return this * Math.PI / 180;
	};
}

module.exports = function () {
	/**
	 * Useful math functions related to geopositioning
	 *
	 * @class Math
	 */
	return {

		/**
		 * Finds the geodistance between two lat, lon points in m.
		 *
		 * @param lat1
		 * @param lon1
		 * @param lat2
		 * @param lon2
		 * @returns {number} metres between the two given points
		 */
		geodist: function (lat1, lon1, lat2, lon2) {
			var theta1 = lat1.toRad();
			var theta2 = lat2.toRad();
			var lambda = (lon2 - lon1).toRad();
			var R = 6371000; // earth's radius, gives result in m

			return Math.acos(Math.sin(theta1) * Math.sin(theta2) + Math.cos(theta1) * Math.cos(theta2) * Math.cos(lambda)) * R;
		}

	}
};

