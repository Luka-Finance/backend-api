/*************************************************************************
SETTINGS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Settings = sequelize.define(
		'settings',
		{
			key: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			value: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);

	// Settings.associate = function (models: any) {};

	return Settings;
}
