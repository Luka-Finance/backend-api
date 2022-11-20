/*************************************************************************
UTILITY TRANSACTIONS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var UtilityTransactions = sequelize.define(
		'utilityTransactions',
		{
			ref: { type: Sequelize.STRING },
			utility: { type: Sequelize.STRING },
			amount: {
				type: Sequelize.DOUBLE.UNSIGNED,
				deafultValue: 0.0,
				allowNull: false,
			},
			commission: {
				type: Sequelize.DOUBLE.UNSIGNED,
				deafultValue: 0.0,
				allowNull: false,
			},
			narration: { type: Sequelize.STRING },
			gateway: { type: Sequelize.STRING },
			status: { type: Sequelize.STRING },
		},
		{
			freezeTableName: true,
		}
	);

	UtilityTransactions.associate = function (models: any) {
		models.utilityTransactions.belongsTo(models.staffs, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		models.utilityTransactions.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
		models.utilityTransactions.belongsTo(models.transactions, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'transactionId' });
	};

	return UtilityTransactions;
}
