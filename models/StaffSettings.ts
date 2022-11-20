/*************************************************************************
STAFF SETTINGS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var StaffSettings = sequelize.define(
		'staffSettings',
		{
			twoFa: {
				type: Sequelize.BOOLEAN,
				defaultValue: false,
				allowNull: false,
			},
			twoFaChannel: {
				type: Sequelize.ENUM('email', 'phone'),
				defaultValue: 'phone',
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);

	StaffSettings.associate = function (models: any) {
		models.staffSettings.belongsTo(models.staffs, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
	};

	return StaffSettings;
}
