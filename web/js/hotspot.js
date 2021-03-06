var apiUrl = 'http://centi.cs.dal.ca:8001';
//var apiUrl = 'http://10.10.1.7:8001';
var sessionkey = null;
var watchID = null;
var map = null;
var markers = {};


// if the map should be repositioned next reload
var repositionMap = false;

/**
 * Gets the location of the spot via the mouse click 
 * 
 *
 * @method clickingplace
 */
var clickingplace = function() {
   var r=confirm("Add Location?");
   if (r==true)
   {
      		     
       addingLocation();
   }
    else
   {
       return;
   } 
};


/**
 * Attempts to login an existing user when the login/signin
 * button is clicked.
 *
 * @method existingUser
 */
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
};

/**
 * Completes the user's login, given data from the server
 *
 * @method completeLogin
 * @param {array} data json data 
 */
 var completeLogin = function (data) {
 	sessionkey = data.key;
 	console.log(data);
 	alert('Welcome!'); 
 	$("#signup").hide();
 	$("#signin").hide();
 	$('#map').removeClass('hidden');
 	createMap();
 };

/**
 * Creates a new user, making sure they select a
 * unique username, and logs them in
 *
 * @method newUser
 */
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
		}).fail(function (e) {
			if (e.status == 403) {
				if(username != null && password != null) {
					alert('user already exists');
					username = prompt("Enter your desired username: ");
					checkUser(username, callback);
				}
			} else {
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

		if(password == null) {
			e.status = 403;
		}

		$.post(apiUrl + '/user', {
			username: username,
			password: password
		},function (data) {
			completeLogin(data);
		}).fail(function (e) {
			if (e.status == 403) {
				if(username != null && password!= null) {
					alert('user already exists');
				}
			}
		});
	});
};

var watchLocation = function () {
	watchID = navigator.geolocation.watchPosition(function (position) {
		// console.log(position);
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
	alert("GPS is now ON.");
};

var clearLocation = function () {
	navigator.geolocation.clearWatch(watchID);
	alert("GPS is now OFF.");
}

/**
 * adds a "favourite place" location for the user to the database
 */

var addLocation = function (nameIn, latIn, lonIn) {
    $.post(apiUrl + '/places', {
        key: sessionkey,
        placeName: nameIn,
        lat: latIn,
        lon: lonIn
    }, function (data) {
	updatePlaces();
    });

    setTimeout(updatePlaces, 500);
    alert("Place added.");
};

var removePlace = function (place) {
    var areYouSure = confirm("This will delete the place forever. You sure?");
    removeMarker(place);
    if (areYouSure === true) {
        $.post(apiUrl + '/deleteplace', {
            key: sessionkey,
            placeName: place
        }, function (data) {
        });

		$("#" + place.replace(' ', '-')).remove();
    }
};


/**
 * Create the map on the page
 */
var createMap = function () {
	var path = [];

	var mapOptions = {
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};

	updatePlaces();

	 map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var latLngBounds = new google.maps.LatLngBounds();

	for (var i = 0; i < path.length; i++) {
		latLngBounds.extend(path[i]);
	}

	var usePolyLine = true;

	var mapPath;

	if (usePolyLine) {
		mapPath = new google.maps.Polyline({
			path: path,
			map: map,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});
	} else { // heatmap
		mapPath = new google.maps.visualization.HeatmapLayer({
			data: path,
			map: map
		});
	}

	var marker = new google.maps.Marker({
		map: map,
		title: 'Current Location'
	});

	map.fitBounds(latLngBounds);

	/**
	 * Reload the map
	 *
	 * @param reposition if the map should be repositioned to fit all points
	 */
	var reloadMap = function() {
		$.getJSON('http://centi.cs.dal.ca:8001/points/' + sessionkey, function (data) {
			var lastPoint = null;
			var lastLatLng = null;

			var shouldReposition = (latLngBounds.length == 0 || repositionMap);
			path = [];

			data.forEach(function (v) {
				// time between this point and the last
				var delta = lastPoint == null ? 1 : v.time - lastPoint.time;

				var latLng = new google.maps.LatLng(v.lat, v.lon);

				if (usePolyLine) {
					path.push(latLng);
					mapPath.setPath(path);
				} else {
					path.push({
						location: latLng,
						weight: delta
					});
					mapPath.setData(path);
				}

				google.maps.event.trigger(map, 'resize');
				lastPoint = v;
				lastLatLng = latLng;
				marker.setPosition(latLng);
			});

			if (lastLatLng != null) {
				if (!latLngBounds.contains(lastLatLng)) {
					latLngBounds.extend(lastLatLng);
					map.fitBounds(latLngBounds);
				}
			}
		});
	};

	setInterval(reloadMap, 1000);
	repositionMap = true;
	reloadMap();
};

/*After clicking My Place button, turn to the page of favourate places list*/
var myplace = function(){
 	$("#signup").hide();
 	$("#signin").hide();
 	$('#map').hide();
	/*Any paremeters for the showPlaceList function?*/
	showPlaceList()
};

var quitPlaces = function() {
    $("#map").show();
    $("#toshowbuttons").hide();
};

var updatePlaces = function() {
    //the pathname has not been made yet
    $.getJSON('http://centi.cs.dal.ca:8001/places/' + sessionkey, function (data) {
			var favlist = [];

			data.forEach(function (v) {
			    //longitude and latitude
				var latLng = new google.maps.LatLng(v.lat, v.lon);
				//name of places
                var placename = v.name;
				favlist.push({
					location: latLng,
					name: placename,
					lat: v.lat,
					lon: v.lon
				});
			

			    placeMarker(placename, latLng);

			
			});
	showPlaceList(favlist);
		});
};


var placeMarker = function(name, location){
	if (name in markers) {
		markers[name].setPosition(location);
	} else {
		var marker = new google.maps.Marker({
			position: location,
			map: map,
			title: name
		});

		markers[name]=marker;
	}
};

var removeMarker = function(name){
    if (name in markers) {
		markers[name].setMap(null);
		delete markers[name];
	}
};



var showPlace = function(lat, lng){
    
    $("#map").show();
    $("#toshowbuttons").hide();

   
    map.panTo(new google.maps.LatLng(lat,lng));
//    google.maps.event.trigger(map,'resize');

};
 
var addingLocation = function(){
     
    $("#map").show();
    $("#toshowbuttons").hide();
    var latLng;

    google.maps.event.addListener(map, 'click', function (event) { 
	
	   latLng = event.latLng; 

    if(latLng !=null){
	var placename= prompt("Please enter the name of the location:","Location Name");

	if (placename!=null){
	    addLocation(placename, latLng.lat(), latLng.lng());
        }
    }	
    $("#map").hide();
    $("#toshowbuttons").show(); 
   
  });  

};
