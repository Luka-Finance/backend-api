import { MailType, TransactionDataType, TransactionType } from '../../helpers/types';
import { fnResponse, sendNotificationMail } from '../../helpers/utility';
import DB from '../../controllers/db';
import { Wallet } from './wallets';
import { Staff } from './staffs';

export class Transaction {
	public async create({ ref, transId, amount, commission, narration, gateway, type, status, meta, businessId, staffId }: TransactionDataType) {
		try {
			// const wallet = await new Wallet().getOneByStaffId(Number(staffId));
			const staff = await new Staff().getOne(Number(staffId));
			const transaction = await DB.transactions.create({
				ref,
				transId,
				amount,
				commission,
				narration,
				gateway,
				type,
				status,
				meta,
				businessId,
				staffId,
			});
			await sendNotificationMail(MailType.TRANSACTION, {
				type,
				name: staff.data.firstName,
				email: staff.data.email,
				amount,
				balance: Number(staff.data.staffWallet.balance.toFixed(2)),
			});
			return fnResponse({ status: true, message: `Transaction created!`, data: transaction });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll({
		identity,
		id,
		businessId,
	}: {
		identity: 'staff' | 'admin' | undefined;
		id: number | undefined;
		businessId: number | undefined;
	}) {
		const where: { staffId?: number; businessId?: number } = {};
		const include: any = [];
		const attributes = { exclude: ['staffId', 'updatedAt'] };
		if (identity === 'staff') {
			where.staffId = Number(id);
			// where.businessId = Number(businessId);
		}
		if (identity === 'admin') {
			include.push({ model: DB.staffs });
		}
		console.log(where);
		try {
			const data = await DB.transactions.findAll({ where, include, order: [['id', 'DESC']], attributes });
			if (!data.length) return fnResponse({ status: true, message: `No transaction available!`, data });
			return fnResponse({ status: true, message: `${data.length} transaction${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAllTransactionsByStaffId(staffId: number) {
		try {
			const data = await DB.transactions.findAll({ where: { staffId }, order: [['id', 'DESC']] });
			if (!data.length) return fnResponse({ status: true, message: `No transaction available!`, data });
			return fnResponse({ status: true, message: `${data.length} transaction${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAllTransactionsByBusinessId(businessId: number, invoiceId?: string | number | null) {
		const where: { businessId: number; invoiceId?: string | number | null } = { businessId };
		if (invoiceId || invoiceId === null) where.invoiceId = invoiceId;
		try {
			const data = await DB.transactions.findAll({ where, order: [['id', 'DESC']] });
			if (!data.length) return fnResponse({ status: true, message: `No transaction available!`, data });
			return fnResponse({ status: true, message: `${data.length} transaction${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async sumAllTransactionsByBusinnessId(businessId: number, invoiceId?: string | number | null) {
		const where: { businessId: number; invoiceId?: string | number | null } = { businessId };
		if (invoiceId || invoiceId === null) where.invoiceId = invoiceId;
		try {
			const data = await DB.transactions.sum('amount', { where });
			return fnResponse({ status: true, message: `success`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne({ identity, id }: { identity: 'staff' | 'admin' | undefined; id: number }) {
		const include: any = [];
		const attributes = { exclude: ['staffId', 'updatedAt'] };
		if (identity === 'admin') {
			include.push({ model: DB.staffs });
		}
		try {
			const data = await DB.transactions.findOne({ where: { id }, include, attributes });
			if (!data) return fnResponse({ status: false, message: `Transaction with id ${id} not found!` });
			return fnResponse({ status: true, message: `Transaction retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, status, meta, invoiceId }: { id: number; status?: string; meta?: any; invoiceId?: number }) {
		try {
			const docData = await DB.transactions.findOne({ where: { id } });
			if (!docData) return fnResponse({ status: false, message: `Transaction with id ${id} not found!` });
			await docData.update({ status, meta, invoiceId });
			return fnResponse({ status: true, message: `Transaction successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async updateWithInvoiceId(invoiceId: number, businessId: number) {
		try {
			const data = await DB.transactions.findAll({
				where: { invoiceId: null, businessId, type: TransactionType.DEBIT },
				include: { model: DB.staffs, attributes: ['id', 'firstName', 'lastName', 'email'] },
			});
			console.log('all transaction for business', JSON.stringify(data));
			if (data.length) await data.update({ invoiceId });
			return fnResponse({ status: true, message: `Transaction successfully updated!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.transactions.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Transaction with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Transaction successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
