var debug = require("debug")("app:controllers:projecttype");

var model = $app.model("ProjectType");

module.exports.getAll = () => {
	return model.find();
};