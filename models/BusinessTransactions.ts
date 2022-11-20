/*************************************************************************
BUSINESS TRANSACTIONS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var BusinessTransactions = sequelize.define(
		'businessTransactions',
		{
			ref: { type: Sequelize.STRING },
			transId: { type: Sequelize.STRING },
			amount: {
				type: Sequelize.DOUBLE.UNSIGNED,
				deafultValue: 0.0,
				allowNull: false,
			},
			narration: { type: Sequelize.STRING },
			gateway: { type: Sequelize.STRING },
			type: { type: Sequelize.ENUM('credit', 'debit'), allowNull: false },
			status: { type: Sequelize.ENUM('pending', 'success', 'failed'), defaultValue: 'pending', allowNull: false },
			businessId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			meta: { type: Sequelize.JSON },
		},
		{
			freezeTableName: true,
		}
	);

	BusinessTransactions.associate = function (models: any) {
		models.businessTransactions.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
	};

	return BusinessTransactions;
}
