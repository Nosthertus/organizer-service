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

module.exports.BaseError          = BaseError;
module.exports.AuthorizationError = AuthorizationError;