var debug = require("debug")("app:controllers:index");

var UserController = $app.controller("UserController");

/**
 * Registers a user in the database
 * 
 * @param  {Object}  body The object form body to insert into the database
 * @return {Promise}      The result of the user insertion
 */
module.exports.register = body => {
	return UserController.create(body)
		.catch(error => {
			// Unique constraint duplicate error
			if(error.name == "SequelizeUniqueConstraintError"){
				error.code = "00"; // User already exists
			}

			debug(error);

			throw error;
		});
}

module.exports.authenticate = body => {
	return UserController.authenticate(body);
};