/*************************************************************************
INVOICES TABLE
*************************************************************************/

import { InvoiceStatus } from '../helpers/types';

export default function (sequelize: any, Sequelize: any) {
	var Invoices = sequelize.define(
		'invoices',
		{
			title: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			total: {
				type: Sequelize.DOUBLE,
				allowNull: false,
			},
			items: {
				type: Sequelize.JSON,
				allowNull: false,
			},
			status: {
				type: Sequelize.ENUM(InvoiceStatus.PAID, InvoiceStatus.NOT_PAID),
				defaultValue: InvoiceStatus.NOT_PAID,
				allowNull: false,
			},
			dueDate: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		},
		{
			freezeTableName: true,
		}
	);

	Invoices.associate = function (models: any) {
		models.invoices.belongsTo(models.businesses, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'businessId' });
		models.invoices.hasMany(models.transactions, { onDelete: 'cascade', targetKey: 'id', foreignKey: 'invoiceId' }); //might remove
	};

	return Invoices;
}
