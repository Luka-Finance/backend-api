import { fnResponse } from '../../helpers/utility';
import DB from '../../controllers/db';
import { TransactionType } from '../../helpers/types';

export class Wallet {
	public async create({ businessId, staffId }: { businessId: number; staffId: number }) {
		try {
			await DB.staffWallets.create({ businessId, staffId });
			return fnResponse({ status: true, message: `Wallet created!` });
		} catch (error) {
			console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll() {
		try {
			const data = await DB.staffWallets.findAll();
			if (!data.length) return fnResponse({ status: true, message: `No wallet available!`, data });
			return fnResponse({ status: true, message: `${data.length} wallet${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAllByBusinessId(businessId: number) {
		try {
			const data = await DB.staffWallets.findAll({ where: { businessId } });
			if (!data.length) return fnResponse({ status: true, message: `No wallet available!`, data });
			return fnResponse({ status: true, message: `${data.length} wallet${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOneById(id: number) {
		const include: any = [{ model: DB.packages }];
		try {
			const data = await DB.staffWallets.findOne({ where: { id }, include });
			if (!data) return fnResponse({ status: false, message: `Wallet with id ${id} not found!` });
			return fnResponse({ status: true, message: `Wallet retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
	public async getOneByStaffId(staffId: number) {
		try {
			const data = await DB.staffWallets.findOne({ where: { staffId } });
			if (!data) return fnResponse({ status: false, message: `Wallet with staffId ${staffId} not found!` });
			return fnResponse({ status: true, message: `Wallet retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ staffId, balance, type }: { staffId: number; balance: number; type: TransactionType }) {
		try {
			const walletData = await DB.staffWallets.findOne({ where: { staffId } });
			if (!walletData) return fnResponse({ status: false, message: `Wallet with id ${staffId} not found!` });
			await DB.sequelize.query(
				`UPDATE staffWallets SET balance = (staffWallets.balance + ${
					type === TransactionType.CREDIT ? Number(balance) : Number(-balance)
				}), earned = (staffWallets.earned + ${type === TransactionType.CREDIT ? Number(balance) : 0}), withdrawn = (staffWallets.withdrawn + ${
					type === TransactionType.DEBIT ? Number(balance) : 0
				}) WHERE staffId = ${staffId}`
			);
			// await walletData.update({
			// 	balance: Number(walletData.balance) + type === TransactionType.CREDIT ? Number(balance) : Number(-balance),
			// 	earned: Number(walletData.earned) + type === TransactionType.CREDIT ? Number(balance) : 0,
			// 	withdrawn: Number(walletData.withdrawn) + type === TransactionType.DEBIT ? Number(balance) : 0,
			// });
			return fnResponse({ status: true, message: `Wallet successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.staffWallets.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Wallet with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Wallet successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async reset(businessId: number) {
		try {
			const data = await DB.staffWallets.findOne({ where: { businessId } });
			if (!data) return fnResponse({ status: false, message: `Wallet with business id ${businessId} not found!` });
			await data.update({ balance: 0.0, earned: 0.0, withdrawn: 0.0 });
			return fnResponse({ status: true, message: `Wallet successfully reset!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
