var debug = require("debug")("app:lib:Session");
var crypto = require("crypto");
var EventEmitter = require("events").EventEmitter;

class Session extends EventEmitter{
	/**
	 * The Session Class constructor
	 * 
	 * @param {Number} userId The id of the user referenced from the database
	 */
	constructor(userId = null){
		super();
		
		/**
		 * Protected property to store the timer instance of the session
		 * @type {[type]}
		 */
		this._timer = null;

		/**
		 * The life time in seconds of the current session instance
		 * 
		 * @type {Number}
		 */
		this.lifeTime = 3600; 

		/**
		 * The hash token of the current session instance,
		 * if lifetime depletes then this value should become null
		 * 
		 * @type {String|Null}
		 */
		this.hash = null;

		/**
		 * The user id reference from the database
		 *
		 * @alias account_id
		 * @type {User}
		 */
		this.userId = userId;
		
	}

	/**
	 * Creates an instance of timeout with the time in seconds from @lifeTime
	 * property, when time is up.. @killSession() should be called
	 */
	_setTime(){
		this._timer = setTimeout(() => {
			// Kill the session when timer is up
			this.kill();
		}, this.lifeTime * 1000);
	}

	/**
	 * Creates a hash value for the session
	 * 
	 * @throws {Error} If crypto is unabled to create a random value
	 */
	_createHash(){
		return new Promise((resolve, reject) => {
			crypto.randomBytes(24, (error, buffer) => {
				if(error){
					throw error;
				}

				this.hash = buffer.toString("hex");

				this.emit("session.start");

				resolve();
			});
		});
	}

	/**
	 * Starts the current session life
	 * 
	 * @return {Promise} The result of creating the session
	 */
	start(){
		return this._createHash()
			.then(() => {
				this._setTime();

				return this;
			});
	}

	/**
	 * Kills the session data, turning all significant values into null
	 */
	kill(){
		this.hash   = null;
		this._timer = null;
		this.userId = null;

		this.emit("session.end");
	}

	/**
	* Refreshes the current session lifetime
	* this calls #_setTime() for time re-definition
	*/
	refresh(){
		this._setTime();
	}
}

module.exports = Session;