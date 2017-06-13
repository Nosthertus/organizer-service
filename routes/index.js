var debug = require("debug")("app:http:index");

var indexController = $app.controller("indexController");

var register = $app.resource("/register");

/*
 * Register route
 */
register.post(($) => {
	$.end();
});

/*
 * Set all app routes
 */
require("./projecttype");