/*************************************************************************
BUSINESSES TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Businesses = sequelize.define(
		'businesses',
		{
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			country: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			city: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			lukaId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			paysTransactionFee: {
				type: Sequelize.ENUM,
				values: ['employer', 'employee'],
			},
			payday: {
				type: Sequelize.INTEGER,
				validate: {
					len: [1, 30],
				},
			},
			rcNumber: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			type: {
				type: Sequelize.ENUM('registered', 'non-registered'),
				defaultValue: 'registered',
			},
			address: {
				type: Sequelize.STRING,
			},
			contactPersonName: {
				type: Sequelize.STRING,
			},
			contactPersonEmail: {
				type: Sequelize.STRING,
			},
			contactPersonRole: {
				type: Sequelize.STRING,
			},
			contactPersonPhone: {
				type: Sequelize.STRING,
			},
			cacDoc: {
				type: Sequelize.STRING,
			},
			virtualAccountData: {
				type: Sequelize.JSON,
			},
			verifiedAt: Sequelize.DATE,
		},
		{
			indexes: [
				{
					unique: true,
					fields: ['lukaId'],
				},
				{
					unique: true,
					fields: ['email'],
				},
				{
					unique: true,
					fields: ['rcNumber'],
				},
			],
		},
		{
			freezeTableName: true,
		}
	);

	Businesses.associate = function (models: any) {
		models.businesses.belongsTo(models.commissions, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'commissionId' });
		models.businesses.hasMany(models.staffs, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
		// models.businesses.hasMany(models.staffWallets, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
		models.businesses.hasMany(models.staffCards, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
		models.businesses.hasMany(models.transactions, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
		models.businesses.hasMany(models.businessTransactions, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
		models.businesses.hasMany(models.invoices, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
		models.businesses.hasOne(models.businessWallets, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
	};

	return Businesses;
}
