var debug = require("debug")("app:http:projecttype");

var projecttype           = $app.resource("/projecttype");
var projecttypeController = $app.controller("projecttypeController");

/*
 * Get a list of all projects
 */
projecttype.get($ => {
	projecttypeController.getAll()
		.then(data => {
			$.data = data;
			$.json();
		})
		.catch(error => {
			debug(error);
			$.status(404);
			$.end();
		});
});