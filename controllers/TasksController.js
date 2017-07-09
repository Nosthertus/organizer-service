var debug = require("debug")("app:controllers:tasks");
var Errors = require("./../lib/Errors");

var model = $app.model("Task");

/**
 * Creates a new project record in the database
 * 
 * @param  {Object}            body    The data to insert in the database
 * @param  {Session}           session The session of the current request
 * @throws {AuthorizationEror} If      The session was not found in the request
 * @return {Promise}                   The resulf ot the project insertion
 */
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
module.exports.getAll = function(scope = "bash", criteria = {}){
	return model.findByScope(scope, criteria);
};

/**
 * Fetches a project record from the database
 * 
 * @param  {Object}        criteria The conditions of the project document search
 * @param  {String}        scope    The scope to apply in the collection's search
 * @throws {NotFoundError} If       There is no record found in the collection database
 * @return {Promise}                The result of the search
 */
module.exports.get = function(criteria, scope = null){
	return model.findOne(criteria).then((record) => {
		if(!record){
			throw new Errors.NotFoundError("Project");
		}

		return record;
	});
};

/**
 * Updates a project record from the database
 * This should call @get in order to retrieve the project before update
 * 
 * @param  {Object}  criteria The conditions of the project document search
 * @param  {Object}  data     The body to set in the project's update
 * @return {Promise}          The result of the update
 */
module.exports.update = function(criteria, data){
	return this.get(criteria)
		.then(record => {
			return record.update(data)
				.then(data => {
					return {passed: (data.ok == 1 ? true : false)};
				})
		});
};

/**
 * Deletes a project record from the database
 * it should first call #this.get to find the record,
 * if record was found then it proceeds to delete
 * 
 * @param  {Object}  criteria The condition of the record search
 * @return {Promise}          The result of deleting the record in the database
 */
module.exports.delete = function(criteria){
	return this.get(criteria)
		.then(record => {
			if(record){
				return record.delete();
			}
		})
};