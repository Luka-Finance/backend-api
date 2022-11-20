// Import settings
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

// Import function files
import { successResponse, errorResponse } from '../helpers/utility';
import { FnResponseDataType } from '../helpers/types';
import { Setting } from '../services/models/settings';

// register or create admin
const createSetting = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { key, value } = req.body;
	const settings = new Setting();
	try {
		const { status, message }: FnResponseDataType = await settings.create({ key, value });
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get all documents
const getSettings = async (req: Request, res: Response) => {
	const settings = new Setting();
	try {
		const { status, message, data }: FnResponseDataType = await settings.getAll();
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// get document details
const getSettingDetails = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const settings = new Setting();
	try {
		const { status, message, data }: FnResponseDataType = await settings.getOne(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message, data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// update document
const updateSetting = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const { value } = req.body;
	const settings = new Setting();
	try {
		const { status, message }: FnResponseDataType = await settings.update({ id: Number(id), value });
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

// delete document
const deleteSetting = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { id } = req.params;
	const settings = new Setting();
	try {
		const { status, message }: FnResponseDataType = await settings.delete(Number(id));
		if (!status) return errorResponse(res, message);
		return successResponse(res, message);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export default {
	createSetting,
	getSettings,
	getSettingDetails,
	updateSetting,
	deleteSetting,
};
