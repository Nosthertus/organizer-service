var debug = require("debug")("app:http:tasks");

var controller = $app.controller("TasksController");
var bash       = $app.resource("/tasks");
var detail     = $app.resource("/tasks/:id");

bash.post($ => {
	controller.create($.body, $.session)
		.then(data => {
			$.data = data;

			$.json();
		})
		.catch(error => {
			debug(error);
			
			if(typeof error.code != "undefined" && error.code == "01"){
				$.status(401);
				$.data = error;

				$.json();
			}

			else{
				$.status(500);
				$.end();
			}

		});
});

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

detail.put($ => {
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
});