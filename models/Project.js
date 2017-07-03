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
		type: Date,
		default: null
	}
});

Project.pre("update", function(next){
	this.update_time = new Date();

	next();
});

Project.method("delete", function(){
	this.delete_time = new Date();

	return this.save();
});

module.exports = Mongoose.model("Project", Project);