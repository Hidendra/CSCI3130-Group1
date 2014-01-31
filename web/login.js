var existingUser = function () {
	userLogin = prompt('Enter your user name:');
	if (userLogin == null) {
		return;
	}
	password = prompt('Enter your password:');
	if (password == null) {
		return;
	}

	$.post('http://centi.cs.dal.ca:8001/user/' + userLogin, {
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
	var userLogin = null;
	var password = null;

	//create the new user and check for duplication
	while (userLogin == null) {
		userLogin = prompt('Enter your desired user name:');
	}

	while (password == null) {
		password = prompt('Enter your password:');
	}

	$.post('http://centi.cs.dal.ca:8001/user', {
		username: userLogin,
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
