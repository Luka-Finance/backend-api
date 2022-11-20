/*************************************************************************
BENEFICIARIES TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Beneficiaries = sequelize.define(
		'beneficiaries',
		{
			bankName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			bankCode: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			bankAccountName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			bankAccountNumber: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			alias: Sequelize.STRING,
		},
		{
			freezeTableName: true,
		}
	);

	Beneficiaries.associate = function (models: any) {
		models.beneficiaries.belongsTo(models.staffs, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
	};

	return Beneficiaries;
}
