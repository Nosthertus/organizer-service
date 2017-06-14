var debug = require("debug")("app:http:index");

var indexController = $app.controller("indexController");

var register = $app.resource("/register");

/**
 * The response object
 * 
 * @type {Object}
 * @todo Optimize this approach
 */
var response = {
	passed: false,
	data: {},
	error:{
		code: "",
		message: "",
		fields: []
	}
};

/*
 * Register route
 */
register.post(($) => {
	indexController.register($.body)
		.then(result => {
			$.data = result;

			$.status(201);
			$.json();
		})
		.catch(error => {
			// User already exists
			if(error.code == "00"){
				response.error.code = error.code;
				response.error.message = "User already exists";

				// Conflict status response
				$.status(409);
				$.data = response;
				$.json();
			}

			// Unknown error
			else{
				$.status(500);
				$.data = response;
				$.json();
			}
		});
});

/*
 * Set all app routes
 */
require("./projecttype");