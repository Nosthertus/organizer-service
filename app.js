var diet      = require("diet");
var sequelize = require("sequelize");
var debug     = require("debug")("app");
var logger    = require("./lib/logger");

//////////////////////////
// Set global variables //
//////////////////////////
global.$app = diet({silent: true});
global.$db  = require("./database");

$app.listen(80, null, () => {
	debug("Service started")
});

require("./routes");


////////////////////////
// Footer middlewares //
////////////////////////

// Logger footer must always be at last line
// to ensure it catches every request and responses
$app.footer(logger);