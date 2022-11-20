// Import packages
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import cron from 'node-cron';

// Import function files
import { successResponse, errorResponse, getIdentity } from '../helpers/utility';
import { FnResponseDataType, PowerServiceIDs, PowerVariationCode, UitilityType, VTPassServiceIDs } from '../helpers/types';
import { VTPass } from '../services/vtpass';
import { Utilities } from '../services/models/utilities';

// get all transactions
const getTransactions = async (req: Request, res: Response) => {
	const transaction = new Utilities();
	const { identity, id } = getIdentity(req);
	try {
		const { status, message, data }: FnResponseDataType = await transaction.getAll({ identity, id });
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
	const transaction = new Utilities();
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
	const { meta } = req.body;
	const transaction = new Utilities();
	try {
		const { status, message }: FnResponseDataType = await transaction.update({
			id: Number(id),
			status: req.body.status || '',
			meta: meta || '',
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
	const transaction = new Utilities();
	try {
		const { status, message }: FnResponseDataType = await transaction.delete(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// purchase utility
const purchaseUtility = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorResponse(res, 'Validation Error', errors.array());
	const transaction = new Utilities();
	const vtpass = new VTPass();

	try {
		switch (req.params.type) {
			case UitilityType.AIRTIME: // Handles Airtime Purchase
				const airtime: FnResponseDataType = await transaction.HandleAirtimePurchase({
					staffId: req.staff.id,
					amount: req.body.amount,
					phone: req.body.phone,
					serviceID: req.body.serviceId,
					businessId: req.staff.businessId,
				});
				if (!airtime.status) return errorResponse(res, airtime.message);
				return successResponse(res, airtime.message);
			case UitilityType.DATA: // Handles Data Subscription
				const internet: FnResponseDataType = await transaction.HandleDataSubscription({
					staffId: req.staff.id,
					amount: req.body.amount,
					phone: req.body.phone,
					billersCode: req.body.phone,
					serviceID: req.body.serviceId,
					variation_code: req.body.variation_code,
					businessId: req.staff.businessId,
				});
				if (!internet.status) return errorResponse(res, internet.message);
				return successResponse(res, internet.message);
			case UitilityType.CABLE: // Handles Cable Subscription
				const smartcardNumberverificationData: { billersCode: string; serviceID: VTPassServiceIDs } = {
					billersCode: req.body.merchantCode,
					serviceID: req.body.serviceId,
				};
				const verifiedSmartcard: { code: string; content: any } = await vtpass.verifyMerchant(smartcardNumberverificationData);
				if (verifiedSmartcard.content.error) return errorResponse(res, verifiedSmartcard.content.error);
				const cable = await transaction.HandleCableSubscription({
					staffId: req.staff.id,
					amount: req.body.amount,
					serviceID: req.body.serviceId,
					billersCode: req.body.merchantCode,
					variation_code: req.body.variation_code,
					phone: req.body.phone,
					subscription_type: req.body.subscription_type,
					quantity: req.body.quantity,
					businessId: req.staff.businessId,
				});
				if (!cable.status) return errorResponse(res, cable.message, cable.data);
				return successResponse(res, cable.message, cable.data);
			case UitilityType.POWER: // Handles Power Subscription
				const MeterNumberVerificationData: { billersCode: string; serviceID: VTPassServiceIDs; type: PowerVariationCode } = {
					billersCode: req.body.merchantCode,
					serviceID: req.body.serviceId,
					type: req.body.variation_code,
				};
				const verifiedMeter: { code: string; content: any } = await vtpass.verifyMerchant(MeterNumberVerificationData);
				if (verifiedMeter.content.error) return errorResponse(res, verifiedMeter.content.error);
				const power = await transaction.HandlePowerSubscription({
					staffId: req.staff.id,
					amount: req.body.amount,
					serviceID: req.body.serviceId,
					billersCode: req.body.merchantCode,
					variation_code: req.body.variation_code,
					phone: req.body.phone,
					businessId: req.staff.businessId,
				});
				if (!power.status) return errorResponse(res, power.message, power.data);
				return successResponse(res, power.message, power.data);
			default:
				return errorResponse(res, 'Invalid Uitility type!');
		}
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get variation codes
const getVariationCodes = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorResponse(res, 'Validation Error', errors.array());
	const { serviceId }: any = req.params;
	try {
		const { content } = await new VTPass().getServiceVariations(serviceId);
		return successResponse(res, 'Successful', content);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// verify merchants
const verifyMerchant = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorResponse(res, 'Validation Error', errors.array());
	const { merchantCode, serviceId, merchantType }: any = req.body;
	const verificationData: { billersCode: string; serviceID: VTPassServiceIDs; type?: PowerVariationCode } = {
		billersCode: merchantCode,
		serviceID: serviceId,
	};
	if (merchantType) verificationData.type = merchantType;
	try {
		const { content } = await new VTPass().verifyMerchant(verificationData);
		if (content.error) return errorResponse(res, content.error);
		return successResponse(res, 'success', content);
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
	purchaseUtility,
	getVariationCodes,
	verifyMerchant,
};
