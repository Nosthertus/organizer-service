var debug = require("debug")("app:controllers:projects");
var Errors = require("./../lib/Errors");

var model = $app.model("Project");

module.exports.create = function(body, session){
	if(session == null){
		return Promise.reject(new Errors.AuthorizationError());
	}

	body.creator = session.userId;
	
	return model.create(body);
};

/**
 * Gets the list of the projects from the database
 * 
 * @param  {String}  scope The scope to use in the model
 * @return {Promise}       The result of the model search
 */
module.exports.getAll = function(scope = "bash"){
	return model.find({}, null, {limit: 10});
};

module.exports.get = function(id){
	return model.findById(id).then((record) => {
		if(!record){
			throw new Errors.NotFoundError("Project");
		}

		return record;
	})
};

module.exports.update = function(id, data){
	return this.get(id)
		.then(record => {
			return record.update(data)
				.then(data => {
					return {passed: data.ok == 1 ? true : false};
				})
		});
};

/**
 * Deletes a project record from the database
 * it should first call #this.get to find the record,
 * if record was found then it proceeds to delete
 * 
 * @param  {Number}  id The id of the record
 * @return {Promise}    The result of deleting the record in the database
 */
module.exports.delete = function(id){
	return this.get(id)
		.then(record => {
			if(record){
				return record.delete();
			}
		})
};

module.exports.assign = function(userid, projectid, creator = false){
	var body = {
		"user_id": userid,
		"project_id": projectid,
		"creator": creator
	};

	return userRelation.create(body);
};