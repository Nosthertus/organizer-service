var debug = require("debug")("app:lib:scopes");
var _     = require("utils-pkg");

module.exports = function(schema, options){
	// debug(schema);

	function getScopedFields(scope){
		var scoped = {};
		var opts   = schema.options;

		if(typeof opts.scopes !== "undefined"){
			for(p in schema.tree){
				if(_.inArray(opts.scopes[scope], p)){
					scoped[p] = true;
				}
			}
		}

		return scoped;
	}

	schema.static("findByScope", function(scope, criteria = {}){
		return this.find(criteria, getScopedFields(scope));
	});
};