/*************************************************************************
STAFF CARDS TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var StaffCards = sequelize.define(
		'staffCards',
		{
			meta: {
				type: Sequelize.JSON,
				allowNull: false,
			},
			status: {
				type: Sequelize.ENUM('active', 'disabled', 'expired'),
				defaultValue: 'active',
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);

	StaffCards.associate = function (models: any) {
		models.staffCards.belongsTo(models.staffs, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'staffId' });
		models.staffCards.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
	};

	return StaffCards;
}
