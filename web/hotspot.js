var apiUrl = 'http://centi.cs.dal.ca:8001';
//var apiUrl = 'http://10.10.1.7:8001';
var sessionkey = null;

var existingUser = function () {
	/**
    * Set the default values for username and password to be empty string
    * So it won't conflict to null value which is returned when cancle or close button is hit
	*/
	var username = "";
	var password = "";

	/**
	*if no input for username, use a prompt to ask for it
	*/
	username = prompt('Enter your username:');
	while (username == "") {
		alert("Your username cannot be empty");
		username = prompt('Enter your username:');
		if(username == null){
			break;
		}
	}
    
    /** 
    * null value will be returned if cancle or close button is hit
    * if the username is null, set the password to null 
    * So it won't have the prompt box for password
    */
	if(username == null)
		password = null;

   if(password != null){
   	    password = prompt('Enter your password:');
	    while (password == "") {
		    alert("Your password cannot be empty");
		    password = prompt('Enter your password:');
		    if(password == null){
			    break;
			}
	    }
   }
   
   if( password == null ){
   		e.status = 404;
   }
    

	$.post(apiUrl + '/user/' + username, {
		password: password
	},function (data) {
		completeLogin(data);

	}).fail(function (e) {
			if (e.status == 404 || e.status == 403){
				if((username != null) && (password!= null)) {
				    alert('Invalid user/pw');
				}    
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
	createMap();
};

var newUser = function () {
	var username = "";
	var password = "";

	//create the new user and check for duplication

	username = prompt('Enter your desired username:');

       while (username == "")  {
                alert("Your username cannot be empty");
                username = prompt('Enter your desired username:');
                if(username == null){
                        break;
                }
        }

	

/**
 *@function checks if the user's desired username is currently in the database
 *@param the username
 */
        var checkUser = function (username, callback) {
             $.post(apiUrl + '/checkuser', {
                username: username

        },function (data) {//called when successful
            callback(username);

        }).fail(function (e){
                        if (e.status == 403) {
                              if((username != null) && (password!= null)){
                                   alert('user already exists');
				   username = prompt("Enter your desired username: ");
			           checkUser(username, callback);
                                }
                        }
			else{
		           callback(username);
			}
                });
	};
	

	checkUser(username, function(username){


	if(username == null)
		password = null;

	if(password != null){
   	    password = prompt('Enter your password:');
	    while (password == "") {
		    alert("Your password cannot be empty");
		    password = prompt('Enter your password:');
		    if(password == null){
		    	break;
		    }
	    }
   }

   if( password == null ){
   		e.status = 403;
   }
	

	$.post(apiUrl + '/user', {
		username: username,
		password: password
	},function (data) {
		completeLogin(data);

	}).fail(function (e) {
			if (e.status == 403) {
				if((username != null) && (password!= null)){
				    alert('user already exists');
				}
			}
		});
    });
};

var watchLocation = function () {
	navigator.geolocation.watchPosition(function (position) {
			console.log(position);
			$.post(apiUrl + '/position', {
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
};



var createMap = function () {
	var path = [];

	var mapOptions = {
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var latLngBounds = new google.maps.LatLngBounds();

	for (var i = 0; i < path.length; i++) {
		latLngBounds.extend(path[i]);
	}

	var mapPath = new google.maps.visualization.HeatmapLayer({
		data: path,
		map: map
	});

	var marker = new google.maps.Marker({
		map: map,
		title: 'Current Location'
	});

	map.fitBounds(latLngBounds);

	var reloadMap = function() {
		$.getJSON('http://centi.cs.dal.ca:8001/points/' + sessionkey, function (data) {
			var lastPoint = null;

			path = [];

			data.forEach(function (v) {
				// time between this point and the last
				var delta = lastPoint == null ? 1 : v.time - lastPoint.time;

				var latLng = new google.maps.LatLng(v.lat, v.lon);
				path.push({
					location: latLng,
					weight: delta
				});
				mapPath.setData(path);
				latLngBounds.extend(latLng);
				map.fitBounds(latLngBounds);
				google.maps.event.trigger(map, 'resize');
				lastPoint = v;
				marker.setPosition(latLng);
			});
		});
	};

	setInterval(reloadMap, 1000);
	reloadMap();
};


//fns which loads things in the background,  fns which
//take in text for user/password, fns that true or false login info,fn for new user	
