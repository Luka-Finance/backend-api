/*************************************************************************
ADMINS TABLE
*************************************************************************/

export default (sequelize: any, Sequelize: any) => {
	var Admins = sequelize.define(
		'admins',
		{
			names: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			role: {
				type: Sequelize.ENUM('support', 'control'),
				defaultValue: 'support',
			},
			status: {
				type: Sequelize.ENUM('active', 'inactive', 'suspended'),
				defaultValue: 'inactive',
			},
			lastLogin: Sequelize.DATE,
		},
		{
			indexes: [
				{
					unique: true,
					fields: ['email'],
				},
				{
					unique: true,
					fields: ['phone'],
				},
			],
		},
		{
			freezeTableName: true,
		}
	);

	Admins.associate = (models: any) => {};

	return Admins;
};
