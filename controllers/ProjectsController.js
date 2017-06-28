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
	});
};

module.exports.update = function(id, data){
	return this.get(id)
		.then(record => {
			return record.update(data);
		});
};

module.exports.assign = function(userid, projectid, creator = false){
	var body = {
		"user_id": userid,
		"project_id": projectid,
		"creator": creator
	};

	return userRelation.create(body);
};