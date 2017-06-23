var debug = require("debug")("app:http:projects");

var controller = $app.controller("ProjectsController");
var bash       = $app.resource("/projects");
var detail     = $app.resource("/projects/:id");

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
			debug(error);

			$.status(500);

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