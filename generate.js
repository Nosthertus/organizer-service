var _        = require("utils-pkg");
var Promise  = require("bluebird");
var request  = require("request");
var stdout   = require("./test");
var faker    = require("faker");

var options = {
	uri: "https://randomuser.me/api",
	rows: 100
};

var users = [];
var projects = [];
var projecttype = "596a6fc9cbd37592524cea9d";

gatherUsers().then(populate).then(startSessions).then(sendData);

function gatherUsers(rows = 100){
	return new Promise((resolve, reject) => {
		var uri = `${options.uri}?results=${options.rows}`;

		console.log(`requesting ${options.uri} with ${options.rows} rows`);

		request(uri, (error, response, body) => {
			if(error){
				console.log(error);
			}

			else{
				try{
					var json = JSON.parse(body);

					users = json.results;

					resolve(users);
				}
				catch(e){
					throw new Error("Response is not a JSON type");
				}
			}
		})
	});
}

function populate(data){
	return new Promise((resolve, reject) => {
		_.each(data, (index, value, next) => {
			let options = {
				url: "http://0.0.0.0/register",
				method: "POST",
				json: true,
				body: {
					name: value.login.username,
					password: value.login.password,
					email: value.email
				}
			};

			stdout.write(`inserting: ${value.login.username}`);

			request(options, function(err, response, body){
				if(err){
					console.log(err)
				}

				else{
					if(response.statusCode != 201){
						if(body.error.code){
							if(body.error.code == "00"){
								stdout.end(`already exists`);

								next();
							}
						}
						else{
							stdout.end("unexpected error");
						}
					}

					else{
						value._id = body._id;

						stdout.end("OK");

						next();
					}
				}
			});
		}, () => {
			console.log("Finished populating users");

			resolve();
		});
	});
}

function startSessions(){
	console.log("Starting sessions");

	return new Promise((resolve, reject) => {
		_.each(users, (prop, user, next) => {
			let options = {
				url: "http://0.0.0.0/authenticate",
				method: "POST",
				json: true,
				body: {
					name: user.login.username,
					password: user.login.password,
				}
			};

			stdout.write(`authenticate: ${user.login.username}`);

			request(options, (err, response, body) => {
				if(err){
					console.log(err);

					process.exit(1);
				}

				else if(body.success){
					user.login.token = body.token;

					stdout.end("OK");
				}

				else{
					stdout.end("ERROR");
				}

				next();
			})
		}, () => {
			console.log("Sessions started");

			resolve();
		});
	})
}

function sendData(){
	console.log("Sending data");

	createProject()
		.then(id => {
			projects.push(id);

			insertData();
		});
}

function createProject(user){
	return new Promise((resolve, reject) => {
		if(typeof user == "undefined"){
			user = users[Math.floor(Math.random() * users.length) + 0];
		}

		console.log(`Creating project: ${user._id}`);

		let options = {
			url: "http://0.0.0.0/projects",
			method: "POST",
			json: true,
			headers: {
				"Authorization": `Token ${user.login.token}`
			},
			body: {
				projecttype: projecttype,
				name: faker.company.companyName(),
				description: faker.lorem.paragraphs(),
				status: rand(4)
			}
		};

		request(options, (err, response, body) => {
			if(err){
				reject(err);
			}

			else{
				resolve(body._id);
			}
		})
	});
}

function createTask(projectId, user){
	console.log(`Creating task: ${user._id}/${projectId}`);

	return new Promise((resolve, reject) => {
		let indexed = [];
		let assigned = [];

		for(let i = 0; i < rand(7); i++){
			getAssigned(indexed);
		}

		indexed.forEach(e => {
			if(typeof users[e] !== "undefined"){
				assigned.push(users[e]._id);
			}
		});

		let options = {
			url: `http://0.0.0.0/projects/${projectId}/tasks`,
			method: "POST",
			json: true,
			headers: {
				"Authorization": `Token ${user.login.token}`
			},
			body: {
				name: faker.company.companyName(),
				description: faker.lorem.paragraphs(),
				status: rand(4),
				assigned: assigned
			}
		};

		request(options, (err, response, body) => {
			if(err){
				reject(err);
			}

			else{
				resolve(body._id);
			}
		})
	});
}

function insertData(){
	_.each(users, (index, user, next) => {
		if(rand(10, 1) > 3){
			var projectId = projects[Math.floor(Math.random() * projects.length)];

			createTask(projectId, user)
				.then(id => {
					next();
				});
		}

		else{
			createProject(user)
				.then(id => {
					next();
				});
		}
	});
}

function rand(max, min = 0){
	return Math.floor(Math.random() * max) + min;
}

function getAssigned(list){
	var selected = rand(users.length);

	if(list.includes(selected)){
		list.push(getAssigned(list));
	}

	else{
		list.push(selected);
	}
}