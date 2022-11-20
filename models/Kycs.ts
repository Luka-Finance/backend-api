/*************************************************************************
BUSINESS KYC TABLE
*************************************************************************/

export default function (sequelize: any, Sequelize: any) {
	var Kycs = sequelize.define(
		'kycs',
		{
			rc: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			tin: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			documents: Sequelize.STRING,
			meta: Sequelize.JSON,
		},
		{
			freezeTableName: true,
		}
	);

	Kycs.associate = function (models: any) {
		models.kycs.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
	};

	return Kycs;
}
