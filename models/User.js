/* jshint indent: 2 */

var bcrypt = require("bcrypt");
var debug  = require("debug")("app:models:user");

module.exports = function(sequelize, DataTypes) {
	var model = sequelize.define('user', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(20),
			allowNull: false
		},
		password: {
			type: DataTypes.STRING(100),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(30),
			allowNull: false
		},
		create_time: {
			type: DataTypes.TIME,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		update_time: {
			type: DataTypes.TIME,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		delete_time: {
			type: DataTypes.TIME,
			allowNull: true,
		}
	}, {
		tableName: 'user',
		paranoid: true,
		timestamps: true,
		createdAt: "create_time",
		updatedAt: "update_time",
		deletedAt: "delete_time",
		defaultScope: {
			order: sequelize.col("id")
		},
		hooks:{
			beforeCreate: beforeCreate,
			beforeUpdate: beforeUpdate
		}
	});

	model.login = login;

	/**
	 * Before insert record hook
	 * This should hash the password and proceed with the insertion
	 * 
	 * @param  {Instance} instance The instance of the new model
	 * @return {Promise}           The result of the hook
	 */
	function beforeCreate(instance){
		return hashPassword(instance.get("password"))
			.then(hash => {
				// replace the password with the hash
				instance.password = hash;
			});
	}

	/**
	 * Before update record hook
	 * This should hash the password if the password was changed and then
	 * proceed with the insertion
	 * 
	 * @param  {Instance} instance The instance of the updated model
	 * @return {Promise}           The result of the hook
	 */
	function beforeUpdate(instance){
		if(instance.changed("password")){
			return hashPassword(instance.get("password"))
				.then(hash => {
					// replace the password with the hash
					instance.password = hash;
				});
		}

		else{
			return;
		}
	}

	/**
	 * Hashes the value @password for database storage
	 * 
	 * @param  {String}  password The password value for hashing
	 * @return {Promise}          The result of the hashing
	 */
	function hashPassword(password){
		return new Promise((resolve, reject) => {
			bcrypt.hash(password, 10, (err, hash) => {
				if(err){
					debug(err);
					reject(err);
				}

				resolve(hash);
			});
		});
	}

	/**
	 * Checks the authentication credentials of a user
	 * Finds a user by it's name and compares the hashing values
	 * 
	 * @param  {Object}  credentials The user's credentials
	 * @return {Promise}             The result of the user's authentication
	 */
	function login(credentials){
		var result = {
			success: false,
			data: {}
		};

		// Find the user by the user's name
		return this.findOne({
			where: {
				name: credentials.name
			}
		})
		.then(record => {
			// Hash the credentia's password if user was found
			if(record){
				return bcrypt.compare(credentials.password, record.password)
					.then(success => {
						if(success){
							result.success = true;
							result.data = record;
							
							return result;
						}

						return result;
					});
			}

			else{
				return result;
			}
		})
	};

	return model;
};
