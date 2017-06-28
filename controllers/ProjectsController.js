var debug = require("debug")("app:controllers:projects");
var Errors = require("./../lib/Errors");

var model = $db.import(__dirname + "/../models/Project.js");
var userRelation = $db.import(__dirname + "/../models/project_has_user.js");

module.exports.create = function(body, session){
	if(session == null){
		return Promise.reject(new Errors.AuthorizationError());
	}
	
	return model.create(body)
		.then(record => {
			return this.assign(session.userId, record.id, true)
				.then(() => {
					record.dataValues.user_id = session.userId;

					debug(record.dataValues);

					return record;
				});
		});
};

/**
 * Gets the list of the projects from the database
 * 
 * @param  {String}  scope The scope to use in the model
 * @return {Promise}       The result of the model search
 */
module.exports.getAll = function(scope = "bash"){
	return model.scope(scope).findAll({
		limit: 10
	});
};

module.exports.get = function(id){
	return model.findOne({
		where: { id: id }
	}).then((record) => {
		if(!record){
			throw new Errors.NotFoundError("Project");
		}

		return record;
	})
};

module.exports.update = function(id, data){
	return this.get(id)
		.then(record => {
			return record.update(data);
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
				return record.destroy();
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