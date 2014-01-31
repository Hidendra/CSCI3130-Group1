var existingUser = function () {
	var username = null;
	var password = null;

	while (username == null) {
		username = prompt('Enter your username:');
	}

	while (password == null) {
		password = prompt('Enter your password:');
	}

	$.post('http://centi.cs.dal.ca:8001/user/' + username, {
		password: password
	},function (data) {
		console.log(data);
		alert('Welcome!');
	}).fail(function (e) {
			if (e.status == 404 || e.status == 403) {
				alert('Invalid user/pw');
			}
		});
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

	$.post('http://centi.cs.dal.ca:8001/user', {
		username: username,
		password: password
	},function (data) {
		console.log(data);
		alert('Welcome!');
	}).fail(function (e) {
			if (e.status == 403) {
				alert('user already exists');
			}
		});
}


//fns which loads things in the background, fns which deal with buttons, fns which
//take in text for user/password, fns that true or false login info,fn for new user	
