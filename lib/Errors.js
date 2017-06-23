'use strict';

var util = require("util");

module.exports.BaseError = function(message, code = "00"){
	Error.captureStackTrace(this, this.constructor);

	this.name    = "BaseError";
	this.message = message;
	this.code    = code;
};

util.inherits(module.exports.BaseError, Error);

module.exports.AuthorizationError = function(){
	this.name    = "AuthorizationError";
	this.message = "Prohibited unauthorized access";
	this.code    = "01";
};

util.inherits(module.exports.AuthorizationError, module.exports.BaseError);