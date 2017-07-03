var debug = require("debug")("app:controllers:index");
var Session = require("./../lib/Session");

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

/**
 * Authenticates a user's credentials and creates a session
 * if the authentication is successful
 * 
 * @param  {Object}  body The authentication credentials
 * @return {Promise}      The result of the authentication process
 */
module.exports.authenticate = body => {
	var res = {
		success: false,
		token: ""
	};

	// Authenticate the user with the credentials
	return UserController.authenticate(body)
		.then(result => {
			// Create the session if the authentication was successfull
			if(result.success == true){
				var session = new Session(result.data._id);

				return session.start()
					.then(() => {
						// Store the session in the session collection
						$sessions.storeSession(session);

						res.success = true;
						res.token = session.hash;
						
						return res;
					});

			}

			// Return the intact result object if authentication was unsuccessfull
			return res;
		});
};