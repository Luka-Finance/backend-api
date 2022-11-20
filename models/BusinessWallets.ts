/*************************************************************************
BUSINESS WALLETS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var BusinessWallets = sequelize.define(
		'businessWallets',
		{
			account: {
				type: Sequelize.JSON,
				allowNull: false,
			},
			balance: {
				type: Sequelize.DOUBLE.UNSIGNED,
				defaultValue: 0.0,
				allowNull: false,
			},
			status: {
				type: Sequelize.ENUM('active', 'suspended'),
				defaultValue: 'active',
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);

	BusinessWallets.associate = function (models: any) {
		models.businessWallets.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
	};

	return BusinessWallets;
}
