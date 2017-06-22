var diet              = require("diet");
var dietCORS          = require("diet-cross-origin");
var sequelize         = require("sequelize");
var debug             = require("debug")("app");
var logger            = require("./lib/logger");
var database          = require("./database");
var SessionCollection = require("./lib/SessionCollection");
var AccessControl     = require("./lib/AccessControl");

//////////////////////////
// Set global variables //
//////////////////////////
global.$app = diet({silent: true});
global.$db  = database;
global.$sessions = new SessionCollection();

$app.listen(80, null, () => {
	debug("Service started");
});

var CORS = dietCORS({
	defaults: {
		"allow-origin": "*",
		"allow-headers": ["content-type", "authorization"],
		"allow-credentials": false
	}
})

require("./routes");


////////////////////////
// Header middlewares //
////////////////////////

// CORS module must be always the first middleware to load
// in order to ensure that it detects all routes and sets the global
// headers in all responses
$app.header(CORS);

$app.header(AccessControl.handler);

////////////////////////
// Footer middlewares //
////////////////////////

// Logger footer must always be at last line
// to ensure it catches every request and responses
$app.footer(logger);