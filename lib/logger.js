var debug = require("debug")("app:http");

/**
 * Log all requests
 * It should show @ip request and $status response
 * 
 * @param  {Signal} $ The signal of the request footer
 */
module.exports = $ => {
	var remoteAddress = $.request.connection.remoteAddress.replace(/^.*:/, '');
	var statusCode = $.response.statusCode;

	debug(`${remoteAddress} ${$.method} => ${$.url.pathname} ${statusCode}`);
}