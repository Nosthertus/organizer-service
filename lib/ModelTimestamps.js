var debug = require("debug")("app:lib:timestamps");

module.exports = function(schema, options){
	/**
	 * Define all timestamps
	 * 
	 * @property {Date} create_time Speficies a datetime for the document's creation
	 * @property {Date} update_time Speficies a datetime for the document's creation/update
	 * @property {Date} delete_time Speficies a datetime for the document's deletion
	 */
	schema.add({
		create_time: {
			type: Date,
			default: Date.now
		},
		update_time:{
			type: Date,
			default: Date.now
		},
		delete_time: {
			type: Date,
			default: null
		}
	})

	/**
	 * Before update hook which defines a new datetime in @update_time
	 */
	schema.pre("update", function(next){
		this.update_time = new Date();

		next();
	});

	/**
	 * Delete method which defines a new datetime in @delete_time
	 * this triggers @pre.update hook
	 * 
	 * @return {Result} The result of deleting the document 
	 */
	schema.method("delete", function(){
		this.delete_time = new Date();

		return this.save();
	});

	/**
	 * Finds all documents which have @delete_time property not null
	 * 
	 * @return {Collection} A collection list of all matched documents with delete_time not null
	 */
	schema.static("findDeleted", function(){
		return this.find({delete_time: {
			$ne: null
		}});
	});
};