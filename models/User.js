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

User.method("delete", function(){
	this.delete_time = new Date();

	return this.save();
});

User.pre("save", true, function(next, done){
	debug(this);

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