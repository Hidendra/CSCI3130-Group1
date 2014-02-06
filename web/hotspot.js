var apiUrl = 'http://centi.cs.dal.ca:8001';
var sessionkey = null;

var existingUser = function () {
	var username = null;
	var password = null;

	while (username == null) {
		username = prompt('Enter your username:');
	}

	while (password == null) {
		password = prompt('Enter your password:');
	}

	$.post(apiUrl + '/user/' + username, {
		password: password
	},function (data) {
		completeLogin(data);

	}).fail(function (e) {
			if (e.status == 404 || e.status == 403) {
				alert('Invalid user/pw');
			}
		});
}

var completeLogin = function (data) {
		sessionkey = data.key;
		console.log(data);
		alert('Welcome!');
		$("#signup").hide();
		$("#signin").hide();
     $('#map').removeClass('hidden');
 
}

var newUser = function () {
	var username = null;
	var password = null;

	//create the new user and check for duplication
	while (username == null) {
		username = prompt('Enter your desired username:');
	}

	while (password == null) {
		password = prompt('Enter your password:');
	}

	$.post(apiUrl + '/user', {
		username: username,
		password: password
	},function (data) {
		completeLogin(data);

	}).fail(function (e) {
			if (e.status == 403) {
				alert('user already exists');
			}
		});
}

var watchLocation = function () { 
	navigator.geolocation.watchPosition(function (position) {
		console.log(position);
		$.post(apiUrl +'/position', {
			key: sessionkey,
			lat: position.coords.latitude,
			lon: position.coords.longitude
		});
	    },
	    function (positionError) {
	        $("#error").append("Error: " + positionError.message + "<br />");
	    },
	    {
	        enableHighAccuracy: true,
	        timeout: 10 * 1000 // 10 seconds
	    });
}



//fns which loads things in the background, fns which deal with buttons, fns which
//take in text for user/password, fns that true or false login info,fn for new user	
