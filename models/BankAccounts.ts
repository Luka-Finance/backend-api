/*************************************************************************
BANK ACCOUNTS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var BankAccounts = sequelize.define(
		'bankAccounts',
		{
			bankName: { type: Sequelize.STRING, allowNull: false },
			bankCode: { type: Sequelize.STRING, allowNull: false },
			bankAccountName: { type: Sequelize.STRING, allowNull: false },
			bankAccountNumber: { type: Sequelize.STRING, allowNull: false },
		},
		{ freezeTableName: true }
	);

	BankAccounts.associate = function (models: any) {
		models.bankAccounts.belongsTo(models.staffs, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
	};

	return BankAccounts;
}
