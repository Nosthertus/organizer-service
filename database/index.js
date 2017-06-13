var Sequelize = require("sequelize");
var flutils   = require("flutils");
var debug     = require("debug")("app:database");
var debugSQL  = require("debug")("app:database:SQL");
var config    = flutils.loadJSON("config.json")[(process.env.ENV || "default")];

module.exports = new Sequelize("organizer", config.database.user, config.database.password, {
	dialect: "mysql",
	logging: (log) => {
		debugSQL(log);
	}
});