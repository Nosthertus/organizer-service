var debug = require("debug")("app:models:projecttype");
var Mongoose = require("mongoose");
var Schema = Mongoose.Schema;

var ProjectType = new Schema({
	name: {
		type: String,
		required: true
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
}, {
	// Set the default name of the collection
	collection: "projecttype"
});

ProjectType.pre("update", function(next){
	this.update_time = Date.now;

	next();
});

ProjectType.method("delete", function(){
	this.delete_time = Date.now;

	return this.save();
});

module.exports = Mongoose.model("ProjectType", ProjectType);