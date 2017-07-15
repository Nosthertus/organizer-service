var debug = require("debug")("app:http:tasks");

var controller = $app.controller("TasksController");
var bash       = $app.resource("/projects/:projectid/tasks");
var detail     = $app.resource("/projects/:projectid/tasks/:id");

bash.post($ => {
	$.body.project_id = $.params.projectid;

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
	controller.getAll("bash", {project_id: $.params.projectid})
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
	var criteria = {
		project_id: $.params.projectid,
		_id: $.params.id
	};

	controller.get(criteria)
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
	var criteria = {
		project_id: $.params.projectid,
		_id: $.params.id
	};

	controller.update(criteria, $.body)
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
	var criteria = {
		project_id: $.params.projectid,
		_id: $.params.id
	};

	controller.delete(criteria)
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