var debug = require("debug")("app:controllers:projecttype");

var model = $db.import(__dirname  + "/../models/ProjectType.js");

module.exports.getAll = () => {
	return model.findAll();
};