/*************************************************************************
COMMISSIONS MODELS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Commissions = sequelize.define(
		'commissions',
		{
			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			description: {
				type: Sequelize.TEXT,
			},
			type: {
				type: Sequelize.ENUM('flat', 'percentage'),
				defaultValue: 'flat',
				allowNull: false,
			},
			value: {
				type: Sequelize.DOUBLE.UNSIGNED,
				defaultValue: 0.0,
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);

	Commissions.associate = function (models: any) {
		models.commissions.hasMany(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'commissionId' });
	};

	return Commissions;
}
