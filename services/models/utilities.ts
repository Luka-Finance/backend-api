import {
	AirtimeServiceIDs,
	CableServiceIDs,
	CableSubscriptionType,
	DataServiceIDs,
	PowerServiceIDs,
	PowerVariationCode,
	TransactionGateway,
	TransactionStatus,
	TransactionType,
	UitilityType,
	UtilitiesTransactionDataType,
	VTPassServiceIDs,
} from '../../helpers/types';
import { fnResponse, generateRequestId, randId } from '../../helpers/utility';
import DB from '../../controllers/db';
import { VTPass } from '../vtpass';
import { Wallet } from './wallets';
import { Transaction } from './transactions';

export class Utilities {
	public async create({ ref, utility, amount, narration, status, meta, businessId, staffId, transactionId }: UtilitiesTransactionDataType) {
		try {
			await DB.utilityTransactions.create({
				ref,
				utility,
				amount,
				commission: 0,
				narration,
				gateway: TransactionGateway.VTPASS,
				status,
				meta,
				businessId,
				staffId,
				transactionId,
			});

			return fnResponse({ status: true, message: `Utility Transaction logged!` });
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
			const data = await DB.utilityTransactions.findAll({ where, include, order: [['id', 'DESC']], attributes });
			if (!data.length) return fnResponse({ status: true, message: `No transaction available!`, data });
			return fnResponse({ status: true, message: `${data.length} transaction${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAllUtilitiyTransactionsByStaffId(staffId: number) {
		try {
			const data = await DB.utilityTransactions.findAll({ where: { staffId }, order: [['id', 'DESC']] });
			if (!data.length) return fnResponse({ status: true, message: `No transaction available!`, data });
			return fnResponse({ status: true, message: `${data.length} transaction${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAllUtilitiyTransactionsByBusinessId(businessId: number, invoiceId?: string | number | null) {
		const where: { businessId: number; invoiceId?: string | number | null } = { businessId };
		if (invoiceId || invoiceId === null) where.invoiceId = invoiceId;
		try {
			const data = await DB.utilityTransactions.findAll({ where, order: [['id', 'DESC']] });
			if (!data.length) return fnResponse({ status: true, message: `No transaction available!`, data });
			return fnResponse({ status: true, message: `${data.length} transaction${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne({ identity, id }: { identity: 'staff' | 'admin' | undefined; id: number }) {
		const include: any = [{ model: DB.transactionModels }];
		const attributes = { exclude: ['staffId', 'updatedAt'] };
		if (identity === 'admin') {
			include.push({ model: DB.staffs });
		}
		try {
			const data = await DB.utilityTransactions.findOne({ where: { id }, include, attributes });
			if (!data) return fnResponse({ status: false, message: `Transaction with id ${id} not found!` });
			return fnResponse({ status: true, message: `Transaction retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, status, meta }: { id: number; status?: string; meta?: any }) {
		try {
			const transData = await DB.utilityTransactions.findOne({ where: { id } });
			if (!transData) return fnResponse({ status: false, message: `Transaction with id ${id} not found!` });
			await transData.update({ status: status ? status : transData.status, meta: meta ? meta : transData.meta });
			return fnResponse({ status: true, message: `Transaction successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.utilityTransactions.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Transaction with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Transaction successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async PurchaseAirtime({
		request_id,
		serviceID,
		amount,
		phone,
	}: {
		request_id: string;
		serviceID: VTPassServiceIDs;
		amount: number;
		phone: string;
	}) {
		try {
			const { code, response_description, content } = await new VTPass().purchaseProduct({ request_id, serviceID, amount, phone });
			return fnResponse({ status: code == '000' ? true : false, message: response_description || content.errors });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async DataSubscription({
		request_id,
		serviceID,
		billersCode,
		variation_code,
		phone,
	}: {
		request_id: string;
		serviceID: VTPassServiceIDs;
		billersCode: string;
		variation_code: string;
		phone: string;
	}) {
		try {
			const { code, response_description } = await new VTPass().purchaseProduct({ request_id, serviceID, billersCode, variation_code, phone });
			return fnResponse({ status: code == '000' ? true : false, message: response_description });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async CableSubscription({
		request_id,
		serviceID,
		billersCode,
		variation_code,
		phone,
		subscription_type,
		quantity,
	}: {
		request_id: string;
		serviceID: VTPassServiceIDs;
		billersCode: string;
		variation_code: string;
		phone: string;
		subscription_type: CableSubscriptionType;
		quantity?: number;
	}) {
		try {
			const { code, response_description } = await new VTPass().purchaseProduct({
				request_id,
				serviceID,
				billersCode,
				variation_code,
				phone,
				subscription_type,
				quantity,
			});
			return fnResponse({ status: code == '000' ? true : false, message: response_description });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async PowerSubscription({
		request_id,
		serviceID,
		billersCode,
		variation_code,
		amount,
		phone,
		quantity,
	}: {
		request_id: string;
		serviceID: PowerServiceIDs;
		billersCode: string;
		variation_code: PowerVariationCode;
		amount?: number;
		phone: string;
		quantity?: number;
	}) {
		try {
			const { code, response_description, mainToken, mainTokenUnits, token, units, purchased_code } = await new VTPass().purchaseProduct({
				request_id,
				serviceID,
				billersCode,
				variation_code,
				amount,
				phone,
				quantity,
			});
			return fnResponse({
				status: code == '000' ? true : false,
				message: response_description,
				data: { mainToken, mainTokenUnits, token, units, purchased_code },
			});
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async HandleAirtimePurchase(data: { staffId: number; amount: number; phone: string; serviceID: AirtimeServiceIDs; businessId: number }) {
		const { staffId, amount, phone, serviceID, businessId } = data;
		const wallet = new Wallet();
		const debitWallet = await wallet.update({ staffId, balance: amount, type: TransactionType.DEBIT });
		if (!debitWallet.status) return fnResponse({ status: debitWallet.status, message: 'Unable to debit wallet!' });
		const purchaseData = {
			request_id: generateRequestId(),
			serviceID,
			amount,
			phone,
		};
		const purchase = await this.PurchaseAirtime(purchaseData);
		if (!purchase.status) await wallet.update({ staffId, balance: amount, type: TransactionType.CREDIT });
		const transaction = await new Transaction().create({
			ref: purchaseData.request_id,
			transId: randId(),
			amount,
			commission: 0,
			narration: '',
			gateway: TransactionGateway.LUKA,
			type: TransactionType.DEBIT,
			status: TransactionStatus.SUCCESS,
			businessId,
			staffId,
		});
		await this.create({
			ref: purchaseData.request_id,
			utility: UitilityType.AIRTIME,
			amount,
			narration: '',
			status: TransactionStatus.SUCCESS,
			staffId,
			businessId,
			transactionId: transaction.data.id,
		});
		return fnResponse({ status: purchase.status, message: purchase.message });
	}

	public async HandleDataSubscription({
		staffId,
		amount,
		phone,
		serviceID,
		billersCode,
		variation_code,
		businessId,
	}: {
		staffId: number;
		amount: number;
		phone: string;
		billersCode: string;
		serviceID: DataServiceIDs;
		variation_code: string;
		businessId: number;
	}) {
		const wallet = new Wallet();
		const debitWallet = await wallet.update({ staffId, balance: amount, type: TransactionType.DEBIT });
		if (!debitWallet.status) return fnResponse({ status: debitWallet.status, message: 'Unable to debit wallet!' });
		const purchaseData = {
			request_id: generateRequestId(),
			serviceID,
			phone,
			billersCode,
			variation_code,
		};
		const purchase = await this.DataSubscription(purchaseData);
		if (!purchase.status) await wallet.update({ staffId, balance: amount, type: TransactionType.CREDIT });
		const transaction = await new Transaction().create({
			ref: purchaseData.request_id,
			transId: randId(),
			amount,
			commission: 0,
			narration: '',
			gateway: TransactionGateway.LUKA,
			type: TransactionType.DEBIT,
			status: TransactionStatus.SUCCESS,
			businessId,
			staffId,
		});
		await this.create({
			ref: purchaseData.request_id,
			utility: UitilityType.AIRTIME,
			amount,
			narration: '',
			status: TransactionStatus.SUCCESS,
			staffId,
			businessId,
			transactionId: transaction.data.id,
		});
		return fnResponse({ status: purchase.status, message: purchase.message });
	}

	public async HandleCableSubscription({
		staffId,
		amount,
		phone,
		serviceID,
		billersCode,
		variation_code,
		subscription_type,
		quantity,
		businessId,
	}: {
		staffId: number;
		amount: number;
		phone: string;
		billersCode: string;
		serviceID: CableServiceIDs;
		variation_code: string;
		subscription_type: CableSubscriptionType;
		quantity?: number;
		businessId: number;
	}) {
		const wallet = new Wallet();
		const debitWallet = await wallet.update({ staffId, balance: amount, type: TransactionType.DEBIT });
		if (!debitWallet.status) return fnResponse({ status: debitWallet.status, message: 'Unable to debit wallet!' });
		const purchaseData = {
			request_id: generateRequestId(),
			serviceID,
			phone,
			billersCode,
			variation_code,
			subscription_type,
			quantity,
		};
		const purchase = await this.CableSubscription(purchaseData);
		if (!purchase.status) await wallet.update({ staffId, balance: amount, type: TransactionType.CREDIT });
		const transaction = await new Transaction().create({
			ref: purchaseData.request_id,
			transId: randId(),
			amount,
			commission: 0,
			narration: '',
			gateway: TransactionGateway.LUKA,
			type: TransactionType.DEBIT,
			status: TransactionStatus.SUCCESS,
			businessId,
			staffId,
		});
		await this.create({
			ref: purchaseData.request_id,
			utility: UitilityType.AIRTIME,
			amount,
			narration: '',
			status: TransactionStatus.SUCCESS,
			staffId,
			businessId,
			transactionId: transaction.data.id,
		});
		return fnResponse({ status: purchase.status, message: purchase.message });
	}

	public async HandlePowerSubscription({
		staffId,
		amount,
		phone,
		serviceID,
		billersCode,
		variation_code,
		businessId,
	}: {
		staffId: number;
		amount: number;
		phone: string;
		billersCode: string;
		serviceID: PowerServiceIDs;
		variation_code: PowerVariationCode;
		businessId: number;
	}) {
		const wallet = new Wallet();
		const debitWallet = await wallet.update({ staffId, balance: amount, type: TransactionType.DEBIT });
		if (!debitWallet.status) return fnResponse({ status: debitWallet.status, message: 'Unable to debit wallet!' });
		const purchaseData = {
			request_id: generateRequestId(),
			serviceID,
			amount,
			phone,
			billersCode,
			variation_code,
		};
		const purchase = await this.PowerSubscription(purchaseData);
		if (!purchase.status) await wallet.update({ staffId, balance: amount, type: TransactionType.CREDIT });
		const transaction = await new Transaction().create({
			ref: purchaseData.request_id,
			transId: randId(),
			amount,
			commission: 0,
			narration: '',
			gateway: TransactionGateway.LUKA,
			type: TransactionType.DEBIT,
			status: TransactionStatus.SUCCESS,
			businessId,
			staffId,
		});
		await this.create({
			ref: purchaseData.request_id,
			utility: UitilityType.AIRTIME,
			amount,
			narration: '',
			status: TransactionStatus.SUCCESS,
			staffId,
			businessId,
			transactionId: transaction.data.id,
		});
		return fnResponse({ status: purchase.status, message: purchase.message, data: purchase.data });
	}
}
