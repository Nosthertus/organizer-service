/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('project', {
		id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		projecttype_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'projecttype',
				key: 'id'
			}
		},
		name: {
			type: DataTypes.STRING(40),
			allowNull: false,
			unique: true
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER(1),
			allowNull: false
		},
		create_time: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		update_time: {
			type: DataTypes.DATE,
			allowNull: true,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		delete_time: {
			type: DataTypes.DATE,
			allowNull: true
		}
	}, {
		tableName: 'project',
		paranoid: true,
		timestamps: true,
		createdAt: "create_time",
		updatedAt: "update_time",
		deletedAt: "delete_time",
		scopes: {
			bash: {
				attributes: {
					exclude: ["delete_time", "update_time"]
				}
			}
		}
	});
};
