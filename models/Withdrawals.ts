/*************************************************************************
WITHDRAWALS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Withdrawals = sequelize.define(
		'withdrawals',
		{
			ref: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			amount: {
				type: Sequelize.DOUBLE,
				defaultValue: 0.0,
				allowNull: false,
			},
			balance: {
				type: Sequelize.DOUBLE,
				defaultValue: 0.0,
				allowNull: false,
			},
			narration: { type: Sequelize.STRING },
			accountNumber: { type: Sequelize.STRING },
			accountName: { type: Sequelize.STRING },
			bankName: { type: Sequelize.STRING },
			bankCode: { type: Sequelize.STRING },
			status: {
				type: Sequelize.ENUM('pending', 'rejected', 'approved', 'failed', 'completed'),
				defaultValue: 'pending',
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);

	Withdrawals.associate = function (models: any) {
		models.withdrawals.belongsTo(models.staffs, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		models.withdrawals.belongsTo(models.transactions, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'transactionId' });
	};

	return Withdrawals;
}
