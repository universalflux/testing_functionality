var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var io = require('socket.io');
var morgan = require('morgan');
var currentPort = 3232 || process.env.PORT;
var promisify = require('es6-promisify');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var toolkit = {};


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + '/client')));
app.use(morgan('combined'));

// Routes && Controllers

// ********** MODELS **********


var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/check_it_out');
var Schema = mongoose.Schema;

// USER MODEL //

var UserSchema = new Schema({
	firstName: String,
	lastName: String,
	username: String,
	password: String,
	testUser: Boolean
},
{	timestamps: true

});

mongoose.model('User', UserSchema);
var User = mongoose.model('User');

// END OF USER MODEL //


// PROFILE MODEL //

var ProfileSchema = new Schema ({
	_user: {type: Schema.Types.ObjectId, ref: 'User'},
	about: String,
	age: Number,
	hobbies: Array,
	relStatus: String
},
{	timestamps: true
});

mongoose.model('Profile', ProfileSchema);
var Profile = mongoose.model('Profile');



// END OF PROFILE MODEL //

// TEST FUNCTION //


toolkit.testFunction = function(first, last, uname, password, about, age, hobbies, pword, relStatus) {
	var testUser = {
		firstName: first,
		lastName: last,
		username: uname,
		password: pword,
		testUser: true
	};

	var testProfile = {
		about: about,
		age: age,
		hobbies: hobbies,
		relStatus: relStatus
	};

	User.create(testUser, function(err, win){
		if (err) {
			console.log("Your test-user failed.");
		} else {
			console.log("__________B E G I N  T E S T__________");
			console.log("Test User : " + win.username + " has been successfully inserted into DB.  Success!");
			console.log("Test User Info :" + win);
			User.remove({_id: win}, function(err){
				if(err){
					console.log("Test User Removed?: " + win.username + " couldn't be removed from the database.");
					console.log("__________E N D  T E S T__________");
				} else {
					console.log("Test User Removed?: " + win.username + " has been removed from the database.");
					console.log("__________E N D  T E S T__________");
				}
			})
		}
		}).then(function(){
		Profile.create(testProfile, function(err, got){
		if (err) {
			console.log("Your test-profile failed.");
		} else {
			console.log("__________B E G I N  T E S T__________");
			console.log("Test Profile has been successfully inserted into DB.  Success!");
			console.log("Test Profile Info :" + got);
			Profile.remove({_id: got}, function(err){
				if(err){
					console.log("Test Profile Removed?: Profile couldn't be removed from the database.");
					console.log("__________E N D  T E S T__________");
				} else {
					console.log("Test Profile Removed?: Profile has been removed from the database.");
					console.log("__________E N D  T E S T__________");
				}
			});

			}
	});
	});
}

toolkit.checkOne = function(){
	console.log('Roger');
};
toolkit.checkTwo = function(){
	console.log('Tafoya');
};




toolkit.testFunction = promisify(toolkit.testFunction);





// END OF TEST FUNCTION //

// USER TEST FUNCTION //
toolkit.passwordCompareTest = (password, mixTen) => {
	var rightPass = bcrypt.compareSync(password, mixTen);
	if (rightPass === true) {
		console.log("Password compare test passed");
		console.log("__________E N D  T E S T__________");
	} else {
		console.log("Password compare test failed");
		console.log("__________E N D  T E S T__________");
	}
};

toolkit.userTest = (first, last, uname, pword) => {


 var newUser = {
		firstName: first,
		lastName: last,
		username: uname,
		password: pword,
		testUser: true
};

console.log("Original user: " + "name: " + newUser.firstName + '' + newUser.lastName);
console.log("Password: " + newUser.password);

var raw = newUser.password;

var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync(newUser.password, salt);
newUser.password = hash;

	User.create(newUser, (err, generated) => {
		if (err) console.log("Something went terribly wrong.");
		 else {
			console.log("__________B E G I N  T E S T__________");
			console.log(generated.username + " has been successfully created! ");
			console.log("New User with encrypted password " + generated);
			//to make fail - comment current function and uncomment following function.
			toolkit.passwordCompareTest(pword, hash);
			// toolkit.passwordCompareTest(pword, 'Billy');
		}
	});

}

toolkit.userTest = promisify(toolkit.userTest);
toolkit.userTest('Roger', 'Tafoya', 'uflux', 'potato')
.then(toolkit.testFunction('Roger', 'Tafoya', 'uflux', 'This is me okay?', 'derragon'));



app.listen(currentPort, function(req, res){
	console.log('Hello father ' + currentPort + '. Enjoy your stay!');
});
