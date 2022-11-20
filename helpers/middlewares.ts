// Import packages
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Import db & configs
import config from '../config/configSetup';
import DB from '../controllers/db';

// Import function files
import { errorResponse, handleResponse } from '../helpers/utility';
import { Wallet } from '../services/models/wallets';

export const isAuthorized = async (req: Request, res: Response, next: NextFunction) => {
	//this is the url without query params
	const route: any = req.originalUrl.split('?').shift();
	let publicRoutes: string[] = config.PUBLIC_ROUTES!;

	if (publicRoutes.includes(route)) return next();

	let token: any = req.headers.authorization;
	if (!token) return handleResponse(res, 401, false, `Access Denied / Unauthorized request`);

	try {
		token = token.split(' ')[1]; // Remove Bearer from string
		if (token === 'null' || !token) return handleResponse(res, 401, false, `Unauthorized request`);
		let verified: any = jwt.verify(token, config.JWTSECRET);
		if (!verified) return handleResponse(res, 401, false, `Unauthorized request`);
		console.log('user type', verified.type);
		if (verified.type === 'admin') {
			req.admin = verified;
		} else if (verified.type === 'staff') {
			req.staff = verified;
		} else if (verified.type === 'employer') {
			req.user = verified;
		}
		next();
	} catch (error) {
		handleResponse(res, 400, false, `Token Expired`);
	}
};

export const isAdmin = (roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.admin) return handleResponse(res, 401, false, `Unauthorized access`);
		if (!roles.includes(req.admin.role)) return handleResponse(res, 401, false, `Permission denied`);
		next();
	};
};

export const verifyPin = async (req: Request, res: Response, next: NextFunction) => {
	const { pin } = req.body;
	const { email, businessId } = req.staff;
	if (!pin) return handleResponse(res, 401, false, `Pin required`);
	const staff = await DB.staffs.findOne({ where: { email, businessId }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
	const validPin: boolean = await bcrypt.compareSync(pin, staff.pin);
	if (!validPin) return handleResponse(res, 401, false, 'Incorrect Pin!');
	next();
};

export const checkBalance = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.staff;
	const { amount } = req.body;
	const staffWallet = await new Wallet().getOneByStaffId(id);
	console.log(staffWallet.data.balance);
	switch (1) {
		case Math.sign(amount):
			if (Number(amount) > Number(staffWallet.data.balance)) return errorResponse(res, 'Insufficient available funds');
			next();
			break;
		default:
			return errorResponse(res, 'Value cannot be zero or negative!');
	}
};
