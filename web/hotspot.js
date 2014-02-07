var apiUrl = 'http://centi.cs.dal.ca:8001';
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
}

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



//fns which loads things in the background,  fns which
//take in text for user/password, fns that true or false login info,fn for new user	
