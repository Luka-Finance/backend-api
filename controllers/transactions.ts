// Import packages
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Transaction } from '../services/models/transactions';
import DB from '../controllers/db';

// Import function files
import { successResponse, errorResponse, getIdentity, randId, generateTransactionNarration } from '../helpers/utility';
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
import { SeerBit } from '../services/seerbit';
import { Wallet } from '../services/models/wallets';

// get all transactions
const getTransactions = async (req: Request, res: Response) => {
	const transaction = new Transaction();
	const { identity, id, businessId } = getIdentity(req);
	try {
		const { status, message, data }: FnResponseDataType = await transaction.getAll({ identity, id, businessId });
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get transaction details
const getTransactionDetails = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const transaction = new Transaction();
	const { identity } = getIdentity(req);
	try {
		const { status, message, data }: FnResponseDataType = await transaction.getOne({ identity, id: Number(id) });
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// update transaction
const updateTransaction = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const { meta, invoiceId } = req.body;
	const transaction = new Transaction();
	try {
		const { status, message }: FnResponseDataType = await transaction.update({
			id: Number(id),
			status: req.body.status || '',
			meta: meta || '',
			invoiceId: invoiceId || '',
		});
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// delete transaction
const deleteTransaction = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const transaction = new Transaction();
	try {
		const { status, message }: FnResponseDataType = await transaction.delete(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// name enquiry
const nameEnquiry = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { accountNumber, bankCode } = req.body;
	const seerbit = new SeerBit();
	try {
		const accountData = await seerbit.nameEnquiry({ bankCode, accountNumber });
		if (accountData.code !== '00') return errorResponse(res, accountData.message);
		return successResponse(res, accountData.message, { accountName: accountData.payload.accountName });
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const getBanks = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const seerbit = new SeerBit();
	try {
		const banksData = await seerbit.getBanks();
		if (banksData.code !== '00') return errorResponse(res, banksData.message);
		return successResponse(res, banksData.message, banksData.payload);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export default {
	getTransactions,
	getTransactionDetails,
	updateTransaction,
	deleteTransaction,
	getBanks,
	nameEnquiry,
};
