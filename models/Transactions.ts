/*************************************************************************
TRANSACTIONS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Transactions = sequelize.define(
		'transactions',
		{
			ref: { type: Sequelize.STRING },
			transId: { type: Sequelize.STRING },
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
			type: { type: Sequelize.ENUM('credit', 'debit'), allowNull: false },
			status: { type: Sequelize.STRING },
			meta: { type: Sequelize.JSON },
		},
		{
			freezeTableName: true,
		}
	);

	Transactions.associate = function (models: any) {
		models.transactions.belongsTo(models.staffs, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		models.transactions.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
		models.transactions.belongsTo(models.invoices, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'invoiceId' });
		models.transactions.hasOne(models.withdrawals, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'transactionId' });
	};

	return Transactions;
}
