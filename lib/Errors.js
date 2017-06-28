'use strict';

class BaseError extends Error{
	constructor(message, code = "00"){
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name    = "BaseError";
		this.message = message;
		this.code    = code;
	}
}

class AuthorizationError extends BaseError{
	constructor(){
		super();

		this.name    = "AuthorizationError";
		this.message = "Prohibited authorization access";
		this.code    = "01";
	}
}

/**
 * Not Found Error Class
 * This error should handle all missing resources
 * 
 * @class NotFoundError
 * @extends {BaseError}
 */
class NotFoundError extends BaseError{

	/**
	 * The constructor function of the class
	 * This defines its prototype from @BaseError class
	 * 
	 * @param  {String} resource The name of the resource missing
	 * @this {BaseError}
	 */
	constructor(resource){
		super();

		this.name    = "NotFoundError";
		this.message = `${resource} resource was not found`;
		this.code    = "02";
	}
}

module.exports.BaseError          = BaseError;
module.exports.AuthorizationError = AuthorizationError;
module.exports.NotFoundError      = NotFoundError;