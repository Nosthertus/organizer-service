var debug = require("debug")("app:controllers:index");

var UserController = $app.controller("UserController");

module.exports.register = body => {
	return UserController.create(body)
		.then(record => {
			debug(record);
		})
		.catch(error => {
			// Unique constraint duplicate error
			if(error.name == "SequelizeUniqueConstraintError"){
				error.code = "00"; // User already exists
			}

			debug(error);

			throw error;
		});
}