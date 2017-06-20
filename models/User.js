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

	function login(credentials){
		return this.findOne({
			where: {
				name: credentials.name
			}
		})
		.then(record => {
			if(record){
				return bcrypt.compare(credentials.password, record.password)
					.then(success => {
						if(success){
							return true;
						}

						return false;
					});
			}

			else{
				return false;
			}
		})
	};

	return model
};
