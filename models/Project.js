var debug    = require("debug")("app:models:project");
var Mongoose = require("mongoose");
var Schema   = Mongoose.Schema;

var Project = new Schema({
	projecttype: {
		type: Schema.Types.ObjectId,
		ref: "ProjectType",
		required: true
	},
	creator: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	name: {
		type: String,
		required: true,
		max: [40, "Project name is too long"]
	},
	description: {
		type: String,
		required: false
	},
	status: {
		type: Number,
		required: true,
		max: [1, "Project's status is invalid"]
	}
});

module.exports = Mongoose.model("Project", Project);