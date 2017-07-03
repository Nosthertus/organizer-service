/* jshint indent: 2 */

var bcrypt   = require("bcrypt");
var debug    = require("debug")("app:models:user");
var Mongoose = require("mongoose");
var Schema   = Mongoose.Schema;

var User = new Schema({
	name: {
		type: String,
		required: true,
		lowercasea: true,
		unique: true,
		min: [4, "name is too short"],
		max: [20, "name is too long"]
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
	},
	create_time: {
		type: Date,
		default: Date.now
	},
	update_time: {
		type: Date,
		default: Date.now
	},
	delete_time: {
		type: Date
	}
});

/*
 * Instance methods
 */

User.method("delete", function(){
	this.delete_time = new Date();

	return this.save();
});

/*
 * Class functions
 */

/**
 * Checks the authentication credentials of a user
 * Finds a user by it's name and compares the hashing values
 * 
 * @param  {Object}  credentials The user's credentials
 * @return {Promise}             The result of the user's authentication
 */
User.static("login", function(credentials){
	var result = {
		success: false,
		data: {}
	};

	// Find the user by the user's name
	return this.findOne({name: credentials.name})
		.then(record => {
			// Hash the credentia's password if user was found
			if(record){
				return bcrypt.compare(credentials.password, record.password)
					.then(success => {
						if(success){
							result.success = true;
							result.data = record;
							
							return result;
						}

						return result;
					});
			}

			else{
				return result;
			}
		});
});

User.pre("save", true, function(next, done){
	next();

	hashPassword(this.password)
		.then(hash => {
			this.password = hash;

			done();
		});
});

/**
 * Hashes the value @password for database storage
 * 
 * @param  {String}  password The password value for hashing
 * @return {Promise}          The result of the hashing
 */
function hashPassword(password){
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, 10, (err, hash) => {
			if(err){
				debug(err);
				reject(err);
			}

			resolve(hash);
		});
	});
}

module.exports = Mongoose.model("User", User);