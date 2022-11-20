/*************************************************************************
STAFFS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Staffs = sequelize.define(
		'staffs',
		{
			firstName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			otherName: { type: Sequelize.STRING },
			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			password: Sequelize.STRING,
			pin: Sequelize.STRING,
			phone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			salary: {
				type: Sequelize.DOUBLE,
				defaultValue: 0.0,
				allowNull: false,
			},
			role: {
				type: Sequelize.STRING,
				defaultValue: 'regular',
			},
			gender: Sequelize.ENUM('male', 'female'),
			status: {
				type: Sequelize.ENUM('active', 'suspended', 'deactivated', 'pending'),
				defaultValue: 'pending',
			},
			businessId: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			startDate: { type: Sequelize.DATE, allowNull: false },
			verifiedAt: Sequelize.DATE,
		},
		{
			indexes: [
				{
					unique: true,
					fields: ['phone'],
				},
				{
					unique: true,
					fields: ['email'],
					message: 'Email already exists',
				},
			],
		},
		{
			freezeTableName: true,
		}
	);

	Staffs.associate = function (models: any) {
		models.staffs.hasOne(models.staffWallets, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		models.staffs.hasMany(models.transactions, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		models.staffs.hasMany(models.beneficiaries, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		models.staffs.hasMany(models.bankAccounts, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		models.staffs.hasMany(models.withdrawals, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		// models.staffs.hasMany(models.staffCards, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		// models.staffs.hasMany(models.cardRequests, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		models.staffs.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
	};

	return Staffs;
}
