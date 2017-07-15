var _ = require("utils-pkg");

class stdout{
	static write(message){
		process.stdout.write(message);

		return this;
	}

	static then(message){
		message ? this.write(message) : this.write(` OK \r\n`);

		return this;
	}

	static end(message){
		message ? this.write(` ${message}\r\n`) : this.write("\r\n");
	}
}

module.exports = stdout;