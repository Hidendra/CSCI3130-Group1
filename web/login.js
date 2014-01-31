var userLogin;
var password;

var existingUser = function () {
	userLogin = prompt("Enter your user name: ", "Print here!");
	if (userLogin == null) {
		return;
	}
	password = prompt("Enter your password: ", "Print here!");
	if (password == null) {
		return;
	}

	$.post('http://centi.cs.dal.ca:8001/user/' + userLogin, {
		password: password
	},function (data) {
		console.log(data);
	}).fail(function (e) {
			if (e.status == 404 || e.status == 403) {
				alert('Invalid user/pw');
			}
		});
}

var newUser = function () {
	//Boolean variable to check if the username is taken
	var nameTaken = false;

	//sample name for testing
	var sampleName = "A";

	//create the new user and check for duplication
	do {
		userLogin = prompt("Enter your desired user name: ", "Print here!");
		if (userLogin == null) {
			return;
		}

		//if dupe, alert user that the name was taken and try again
		if (userLogin === sampleName) {
			alert("NAME TAKEN");
			nameTaken = true;

			//if the username was not taken
		} else {
			nameTaken = false;
		}
		//this is a querry seach in the database and if its not there, create the new user.

	} while (nameTaken === true);

	password = prompt("Enter your password:", "Print here!");
	if (password == null) {
		//remove the name from the database
		return;
	}


	//ENTER USER INFORMATION INTO DB
	$.post('http://centi.cs.dal.ca:8001/user', {
		username: userLogin,
		password: password
	},function (data) {
		console.log(data);
	}).fail(function (e) {
			if (e.status == 403) {
				alert("user already exists");
			}
		});

}


//fns which loads things in the background, fns which deal with buttons, fns which
//take in text for user/password, fns that true or false login info,fn for new user	
