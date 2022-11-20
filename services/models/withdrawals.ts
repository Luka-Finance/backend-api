// import { PackagesDataType } from '../../helpers/types';
import { fnResponse } from '../../helpers/utility';
import DB from '../../controllers/db';

export class Withdrawal {
	public async create({ ref, amount, balance, narration, accountNumber, accountName, bankName, bankCode, staffId, transactionId }: any) {
		try {
			await DB.withdrawals.create({ ref, amount, balance, narration, accountNumber, accountName, bankName, bankCode, staffId, transactionId });
			return fnResponse({ status: true, message: `Withdrawal requested!` });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll({ identity, id }: { identity: 'staff' | 'admin' | undefined; id: number | undefined }) {
		const where: { staffId?: number } = {};
		const include: any = [];
		const attributes = { exclude: ['staffId', 'updatedAt'] };
		if (identity === 'staff') {
			where.staffId = Number(id);
		}
		if (identity === 'admin') {
			include.push({ model: DB.staffs });
		}
		try {
			const data = await DB.withdrawals.findAll({ where, include, order: [['id', 'DESC']], attributes });
			if (!data.length) return fnResponse({ status: true, message: `No withdrawals available!`, data });
			return fnResponse({ status: true, message: `${data.length} withdrawal${data.length > 1 ? 's' : ''} retrived!`, data });
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
			const data = await DB.withdrawals.findOne({ where: { id }, include: [{ model: DB.transactions }], attributes });
			if (!data) return fnResponse({ status: false, message: `Withdrawal with id ${id} not found!` });
			return fnResponse({ status: true, message: `Withdrawal listed!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, transactionId }: { id: string | number; transactionId: string | number }) {
		try {
			const data = await DB.withdrawals.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Withdrawal with id ${id} not found!` });
			await data.update({ transactionId });
			return fnResponse({ status: true, message: `Withdrawal successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.withdrawals.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Withdrawal with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Withdrawal successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
