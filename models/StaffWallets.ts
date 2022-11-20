/*************************************************************************
STAFF WALLETS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var StaffWallets = sequelize.define(
		'staffWallets',
		{
			balance: {
				type: Sequelize.DOUBLE.UNSIGNED,
				defaultValue: 0.0,
				allowNull: false,
			},
			earned: {
				type: Sequelize.DOUBLE.UNSIGNED,
				defaultValue: 0.0,
				allowNull: false,
			},
			withdrawn: {
				type: Sequelize.DOUBLE.UNSIGNED,
				defaultValue: 0.0,
				allowNull: false,
			},
			status: {
				type: Sequelize.ENUM('active', 'suspended'),
				defaultValue: 'active',
				allowNull: false,
			},
			staffId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);

	StaffWallets.associate = function (models: any) {
		models.staffWallets.belongsTo(models.staffs, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		// models.staffWallets.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
	};

	return StaffWallets;
}
