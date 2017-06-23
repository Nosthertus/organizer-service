var debug = require("debug")("app:lib:AccessControl");

class AccessControl{
	/**
	* Gets the session from the memory session collection
	* 
	* @param  {String}  token The session hash stored in the memory
	* @return {Session}       The session of the request
	*/
	static getSession(token){
		return $sessions.findByHash(token);
	}

	/**
	 * Parses the authorization value from the header "authorization"
	 * into an authorization object
	 * 
	 * @param  {String} val The authorization value from the header
	 * @return {Object}     The authorization object
	 * @throws {Error}  If  The authorization value has no type and credentials
	 * @throws {Error}  If  The authorization type is not equal to "Token"
	 */
	static parseAuthorization(val){
		val = val.split(" ");

		// Throw error if the authorization is not in the right format
		if(val.length != 2){
			throw new Error("Authorization value is invalid");
		}

		else{
			var auth = {
				type: val[0],
				credentials: val[1]
			};

			// Throw error if the authorization type is not equal to "Token"
			if(auth.type !== "Token"){
				throw new Error(`Authorization for "${auth.type}" type is not valid`);
			}

			return auth;
		}
	}

	/**
	 * Verifies whether an object has an authorization property with "Token" value
	 * 
	 * @param  {Object}  headers The object where the authorization property should exists
	 * @return {Boolean}         Whether the object does have a valid token
	 */
	static hasToken(headers){
		if(headers.hasOwnProperty("authorization")){
			var auth = headers["authorization"].split(" ");

			return auth[0] == "Token";
		}

		return false;
	};

	/**
	 * The signal handler from the request middleware
	 * 
	 * @param  {signal} $ The signal where the request is contained
	 */
	static handler($){
		$.session = null;
		
		// Check if the request has a valid authorization value
		if(AccessControl.hasToken($.headers)){
			var authorization = AccessControl.parseAuthorization($.headers["authorization"]);

			var session = AccessControl.getSession(authorization.credentials);

			// Refresh the session lifetime and extend the session in the current signal
			if(session){
				session.refresh();

				$.session = session;
			}
		}

		$.return();
	};
}

module.exports = AccessControl;