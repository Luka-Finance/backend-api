// Import packages
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Transaction } from '../services/models/transactions';
import config from '../config/configSetup';
import DB from '../controllers/db';
import bcrypt from 'bcryptjs';

// Import function files
import { successResponse, errorResponse, getIdentity, randId, generateTransactionNarration, handleResponse } from '../helpers/utility';
import {
	FnResponseDataType,
	NarrationType,
	PowerServiceIDs,
	PowerVariationCode,
	TransactionGateway,
	TransactionStatus,
	TransactionType,
	UitilityType,
	VTPassServiceIDs,
} from '../helpers/types';
import { VTPass } from '../services/vtpass';
import { Withdrawal } from '../services/models/withdrawals';
import { SeerBit } from '../services/seerbit';
import { Wallet } from '../services/models/wallets';

// get all transactions
const getWithdrawals = async (req: Request, res: Response) => {
	const withdrawal = new Withdrawal();
	const { identity, id } = getIdentity(req);
	try {
		const { status, message, data }: FnResponseDataType = await withdrawal.getAll({ identity, id });
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get transaction details
const getWithdrawalDetails = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const withdrawal = new Withdrawal();
	const { identity } = getIdentity(req);
	try {
		const { status, message, data }: FnResponseDataType = await withdrawal.getOne({ identity, id: Number(id) });
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const payouts = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id, businessId } = req.staff;
	const { amount, bankCode, accountNumber } = req.body;
	const seerbit = new SeerBit();
	const payload = {
		extTransactionRef: `LUK-${new Date().getTime()}`,
		amount,
		debitPocketReferenceId: config.SEERBIT_POCKET_ID,
		type: 'CREDIT_BANK',
		bankCode,
		accountNumber,
	};
	try {
		const debitWallet = await new Wallet().update({ staffId: id, balance: amount, type: TransactionType.DEBIT });
		if (!debitWallet.status) return errorResponse(res, debitWallet.message);
		// await DB.sequelize.query(`UPDATE staffWallets SET balance = (staffWallets.balance - ${amount}) WHERE staffId = ${id}`);
		await new Transaction().create({
			ref: payload.extTransactionRef,
			transId: randId(),
			amount,
			commission: 0.0,
			narration: generateTransactionNarration(NarrationType.REGULAR_SPEND),
			gateway: TransactionGateway.SEERBIT,
			type: TransactionType.DEBIT,
			status: TransactionStatus.SUCCESS,
			businessId,
			staffId: id,
		});
		// const payoutData = await seerbit.fundTransfer(payload);
		// console.log({ payoutData });
		// if (payoutData.code !== '00') return errorResponse(res, payoutData.message);
		return successResponse(res, 'Payment Successful');
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const verifyPin = async (req: Request, res: Response) => {
	const { pin } = req.body;
	const { email, businessId } = req.staff;
	console.log(pin, email, businessId);
	if (!pin) return handleResponse(res, 401, false, `Pin required`);
	const staff = await DB.staffs.findOne({ where: { email, businessId }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
	const validPin: boolean = await bcrypt.compareSync(pin, staff.pin);
	if (!validPin) return handleResponse(res, 401, false, 'Incorrect Pin!');
	return successResponse(res, 'Pin Verified');
};

export default {
	getWithdrawals,
	getWithdrawalDetails,
	payouts,
	verifyPin,
};
