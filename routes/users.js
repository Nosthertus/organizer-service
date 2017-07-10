var debug = require("debug")("app:http:users");

var controller = $app.controller("UsersController");
var bash       = $app.resource("/users");
var detail     = $app.resource("/users/:id");

bash.get($ => {
	controller.getAll()
		.then(data => {
			$.data = data;

			$.json();
		})
		.catch(error => {
			debug(error);

			$.status(500);

			$.end();
		});
});

detail.get($ => {
	controller.get($.params.id)
		.then(data => {
			$.data = data;

			$.json();
		})
		.catch(error => {
			if(typeof error.code !== "undefined"){
				// Resource not found
				if(error.code == "02"){
					$.status(404);
				}
			}

			else{
				debug(error);

				$.status(500);
			}

			$.end();
		});
});

/*detail.put($ => {
	controller.update($.params.id, $.body)
		.then(data => {
			$.data = data;

			$.json();
		})
		.catch(error => {
			debug(error);

			$.status(500);

			$.end();
		});
});

detail.delete($ => {
	controller.delete($.params.id)
		.then(data => {
			$.success();
		})
		.catch(error => {
			if(typeof error.code !== "undefined"){
				// Resource not found
				if(error.code == "02"){
					$.status(404);
				}
			}

			else{
				debug(error);

				$.status(500);
			}

			$.end();
		});
});*/