var debug    = require("debug")("app:models:task");
var Mongoose = require("mongoose");
var Schema   = Mongoose.Schema;

var Comments = new Schema({
	author: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true
	},
	text: {
		type: String,
		required: true
	}
});

var Task = new Schema({
	project_id: {
		type: Schema.Types.ObjectId,
		ref: "Project",
		required: true
	},
	name: {
		type: String,
		required: true,
		max: [40, "Task name is too long"]
	},
	description: {
		type: String,
		required: false
	},
	assigned: [{
		type: Schema.Types.ObjectId,
		ref: "User"
	}],
	comments: [Comments]
});

module.exports = Mongoose.model("Task", Task);