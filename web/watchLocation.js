function startLocating () { 
	navigator.geolocation.watchPosition(function (position) {
		console.log(position);
	    },
	    function (positionError) {
	        $("#error").append("Error: " + positionError.message + "<br />");
	    },
	    {
	        enableHighAccuracy: true,
	        timeout: 10 * 1000 // 10 seconds
	    });
}
