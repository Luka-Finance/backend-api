import { StaffRegisterType } from './../helpers/types';
// Import packages
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Staff } from '../services/models/staffs';

// Import function files
import { successResponse, errorResponse } from '../helpers/utility';
import { FnResponseDataType } from '../helpers/types';
import { Wallet } from '../services/models/wallets';

// register or create admin
const createStaff = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const staffDetails: StaffRegisterType = req.body;
	const staff = new Staff();

	try {
		const { status, message }: FnResponseDataType = await staff.create(staffDetails);
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get all documents
const getStaffs = async (req: Request, res: Response) => {
	const staff = new Staff();
	try {
		const { status, message, data }: FnResponseDataType = await staff.getAll();
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get staff details
const getStaffDetails = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const staff = new Staff();
	try {
		const { status, message, data }: FnResponseDataType = await staff.getOne(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// update staff
const updateStaff = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const { name } = req.body;
	const staff = new Staff();
	try {
		const { status, message }: FnResponseDataType = await staff.update({ id: Number(id), name });
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// delete staff
const deleteStaff = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const staff = new Staff();
	try {
		const { status, message }: FnResponseDataType = await staff.delete(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const findbyBusinessId = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { businessId } = req.params;

	const staff = new Staff();
	try {
		const { status, message, data }: FnResponseDataType = await staff.findbyBusinessId(Number(businessId));
		if (!status) return errorResponse(res, message);

		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const toggleStaff = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { staffId } = req.params;
	const action = req.body.action;

	const staff = new Staff();

	try {
		const { status, message }: FnResponseDataType = await staff.toggleStaff(Number(staffId), action);
		if (!status) return errorResponse(res, message);

		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

const staffDashboard = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorResponse(res, 'Validation Error', errors.array());
	const { id } = req.staff;

	try {
		const { status, message, data }: FnResponseDataType = await new Wallet().getOneByStaffId(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export default {
	createStaff,
	getStaffs,
	getStaffDetails,
	updateStaff,
	deleteStaff,
	findbyBusinessId,
	toggleStaff,
	staffDashboard,
};
