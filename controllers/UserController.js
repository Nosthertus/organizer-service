var debug = require("debug")("app:controllers:user");

var model = $db.import(__dirname + "/../models/User.js");

module.exports.create = data => {
	return model.create(data);
};

module.exports.authenticate = credentials => {
	return model.login(credentials);
};