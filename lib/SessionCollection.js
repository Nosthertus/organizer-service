var debug = require("debug")("app:lib:SessionCollection");

class SessionCollection{
	constructor(){
		this._sessions = [];
	}

	/**
	 * Removes an item from the session collection
	 * 
	 * @protected
	 * @param  {Number}  index The item index to remove in the collection
	 * @return {Boolean}       Whether an item was successfully removed
	 */
	_removeItem(index){
		return this._sessions.splice(index, 1).length > 0;
	}

	/**
	 * Find a session instance by its hash value
	 * 
	 * @param  {String}         hash  The value of the hash which an instance should have
	 * @return {Session | Null}       Session if hash matches, otherwise is null
	 */
	findByHash(hash){
		for(let i = 0; this._sessions.length > i; i++){
			var session = this._sessions[i];

			if(session.hash == hash){
				return session;
			}
		}

		return null;
	}

	/**
	 * Stores a session into the collection list
	 * 
	 * @param  {Session} session The session instance
	 * @throws {Error}   If      The value parameter is not a session instance object
	 */
	storeSession(session){
		if(session.constructor.name !== "Session"){
			throw new Error(`${session.constructor.name} is not a Session instance`);
		}

		this._sessions.push(session);

		var CollectionIndex = this._sessions.length -1;

		session.on("session.end", () => {
			// Block scope the function to ensure index isolation
			(() => {
				this._removeItem(CollectionIndex);
			})();
		});
	}

	/**
	 * Finds and destroy the session stored in the collection
	 * 
	 * @param  {String}  hash The hash value of the session
	 * @return {Boolean}      Whether the session was destroyed
	 */
	destroyByHash(hash){
		var session = this.findByHash(hash);

		// Kill the session if there is a session with the provided hash
		if(session){
			session.kill();

			return true;
		}

		// Return false if the session was not found
		return false;
	}
}

module.exports = SessionCollection;