/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('assignation', {
		user_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'user',
				key: 'id'
			}
		},
		project_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'task',
				key: 'project_id'
			}
		},
		task_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'task',
				key: 'id'
			}
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
		}
	}, {
		tableName: 'assignation'
	});
};
