import { InvoicesDataType } from '../../helpers/types';
import { fnResponse } from '../../helpers/utility';
import DB from '../../controllers/db';

export class Invoice {
	public async create({ title, total, items, dueDate, businessId }: InvoicesDataType) {
		try {
			const invoice = await DB.invoices.create({ title, total, items, dueDate, businessId });
			return fnResponse({ status: true, message: `Invoice created!`, data: invoice });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll(businessId: number) {
		try {
			const data = await DB.invoices.findAll({ order: [['id', 'DESC']] });
			if (!data.length) return fnResponse({ status: true, message: `No invoices available!`, data });
			return fnResponse({ status: true, message: `${data.length} invoice${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAllInvoicesByBusinessId(businessId: number) {
		try {
			const data = await DB.invoices.findAll({ where: { businessId }, order: [['id', 'DESC']] });
			if (!data.length) return fnResponse({ status: true, message: `No invoice available!`, data });
			return fnResponse({ status: true, message: `${data.length} invoice${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne(id: number) {
		try {
			const data = await DB.invoices.findOne({ where: { id }, include: { model: DB.transactions } });
			if (!data) return fnResponse({ status: false, message: `Invoices with id ${id} not found!` });
			return fnResponse({ status: true, message: `Invoices listed!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, title, total, items, dueDate, status, businessId }: InvoicesDataType) {
		try {
			const data = await DB.invoices.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Invoice with id ${id} not found!` });
			const updateData: InvoicesDataType = {
				title: title ? title : data.title,
				total: total ? total : data.total,
				items: items ? items : data.items,
				dueDate: dueDate ? dueDate : data.dueDate,
				status: status ? status : data.status,
			};
			await data.update(updateData);
			return fnResponse({ status: true, message: `Invoice successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.invoices.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Invoice with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Invoice successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
