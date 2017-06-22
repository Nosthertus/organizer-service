/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('project_has_user', {
		project_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'project',
				key: 'id'
			}
		},
		user_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			references: {
				model: 'user',
				key: 'id'
			}
		},
		creator: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: 0
		}
	}, {
		tableName: 'project_has_user',
		timestamps: false
	});
};
