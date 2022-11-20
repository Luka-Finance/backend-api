// Import packages
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// Import function files
import { successResponse, errorResponse, getIdentity } from '../helpers/utility';
import { BusinessVerificationType, FnResponseDataType } from '../helpers/types';
import { Business } from '../services/models/business';
import { Staff } from '../services/models/staffs';
import DB from './db';

// register or create employer
const createEmployer = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const businessDetails = req.body;
	const business = new Business();

	try {
		const { status, message, data }: FnResponseDataType = await business.create(businessDetails);
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};
const login = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const businessDetails = req.body;
	const business = new Business();

	try {
		const { status, message, data }: FnResponseDataType = await business.login(businessDetails);

		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const resendOtp = async (req: Request, res: Response) => {
	const businessDetails = req.body;
	const business = new Business();

	try {
		const { status, message, data }: FnResponseDataType = await business.resendOtp(businessDetails);

		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const verifyOtp = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	// const businessId = +req.params.id;
	const businessDetails = req.body;
	const business = new Business();

	try {
		const { status, message, data }: FnResponseDataType = await business.verifyOtp(businessDetails);

		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const getStats = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const business = new Business();

	const { id } = req.user.data;

	try {
		const { status, message, data }: FnResponseDataType = await business.getStats(id);

		if (!status) return errorResponse(res, message);

		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const getPaymentAccount = async (req: Request, res: Response) => {
	const { id } = req.user.data;
	try {
		const data = await DB.businesses.findOne({ where: { id }, attributes: ['virtualAccountData'] });
		return successResponse(res, 'Payment account fetched', data?.virtualAccountData);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const updateBusiness = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const business = new Business();

	const { id } = req.user.data;
	const businessDetails = req.body;

	try {
		const { status, message, data }: FnResponseDataType = await business.updateBusiness(id, businessDetails);

		if (!status) return errorResponse(res, message);

		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const verify = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const business = new Business();

	const type = req.originalUrl.split('/').pop() as string;
	const doc = req.body;

	try {
		const { status, message, data }: FnResponseDataType = await business.verifyBusiness(type, doc);

		if (!status) return errorResponse(res, message);

		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const getStaffs = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	// console.log(req);
	const { id } = req.user.data;

	const staff = new Staff();
	try {
		const { status, message, data }: FnResponseDataType = await staff.findbyBusinessId(Number(id));
		if (!status) return errorResponse(res, message);

		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const me = async (req: Request, res: Response) => {
	const business = new Business();

	const { id } = req.user.data;

	try {
		const { status, message, data }: FnResponseDataType = await business.me(id);

		if (!status) return errorResponse(res, message);

		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const forgetPassword = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const business = new Business();

	const { email } = req.body;

	try {
		const { status, message, data }: FnResponseDataType = await business.forgetPassword(email);

		if (!status) return errorResponse(res, message);

		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const resetPassword = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const business = new Business();

	const { password, token } = req.body;

	try {
		const { status, message, data }: FnResponseDataType = await business.resetPassword(token, password);

		if (!status) return errorResponse(res, message);

		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const updatePassword = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const business = new Business();

	const { id } = req.user.data;

	const { oldPassword, newPassword } = req.body;

	try {
		const { status, message, data }: FnResponseDataType = await business.updatePassword(id, oldPassword, newPassword);

		if (!status) return errorResponse(res, message);

		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const getPaymentHistory = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const business = new Business();

	const { id } = req.user.data;

	try {
		const { status, message, data }: FnResponseDataType = await business.getPaymentHistory(id);

		if (!status) return errorResponse(res, message);

		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);

		return errorResponse(res, `An error occured - ${error}`);
	}
};

const getInvoices = async (req: Request, res: Response) => {
	const business = new Business();
	const { identity, id, businessId } = getIdentity(req);
	try {
		const { status, message, data }: FnResponseDataType = await business.getInvoices(`${businessId}`);
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export default {
	createEmployer,
	login,
	resendOtp,
	verifyOtp,
	getStats,
	updateBusiness,
	verify,
	getStaffs,
	me,
	forgetPassword,
	resetPassword,
	updatePassword,
	getPaymentHistory,
	getInvoices,
	getPaymentAccount,
};
