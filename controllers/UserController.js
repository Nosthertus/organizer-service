var debug = require("debug")("app:controllers:user");

var model = $app.model("User");

module.exports.create = data => {
	return model.create(data);
};

module.exports.authenticate = credentials => {
	return model.login(credentials);
};