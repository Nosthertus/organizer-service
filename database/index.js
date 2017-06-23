var Sequelize = require("sequelize");
var flutils   = require("flutils");
var moment    = require("moment-timezone");
var debug     = require("debug")("app:database");
var debugSQL  = require("debug")("app:database:SQL");
var config    = flutils.loadJSON("config.json")[(process.env.ENV || "default")];

module.exports = new Sequelize("organizer", config.database.user, config.database.password, {
	dialect: "mysql",
	timezone: moment.tz.guess(),
	logging: (log) => {
		debugSQL(log);
	}
});