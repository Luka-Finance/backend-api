// Import packages
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Import db & configs
import config from '../config/configSetup';
import DB from './db';

// Import function files
import { handleResponse, successResponse, errorResponse, otpValidity, sendNotificationMail } from '../helpers/utility';
import {
	RegisterDataType,
	TokenDataType,
	typeEnum,
	VerifyOtpDataType,
	FnResponseDataType,
	ChangePasswordDataType,
	channelTypeEnum,
	AuthPayloadDataType,
	MailType,
	StaffStatus,
} from '../helpers/types';
import { activateAccount, login, sendOtp } from '../helpers/auth';
import { Op } from 'sequelize';

export const register = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const { names, phone, email, password, businessId } = req.body;

	//Hash password
	const salt: string = await bcrypt.genSalt(15);
	const hashPassword: string = await bcrypt.hash(password, salt);

	let insertData: RegisterDataType = { names, phone, email, password: hashPassword };

	try {
		const userExists: any = await DB.users.findOne({
			where: { [Op.or]: [{ email }, { phone }], businessId },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		});

		// if user exists, stop the process and return a message
		if (userExists) return handleResponse(res, 400, false, `user with email ${email}  or phone ${phone} already exists`);

		const user: any = await DB.users.create(insertData);

		if (user) {
			await DB.userSettings.create({ userId: user.id });
			// let payload: AuthPayloadDataType = {
			// 	id: user.id,
			// 	names,
			// 	phone,
			// 	email,
			// };
			// const token: string = jwt.sign(payload, config.JWTSECRET);
			// const data: TokenDataType = { type: 'token', token, user: payload };
			const regData = await sendOtp({ channel: email, type: typeEnum.VERIFICATION, channelType: channelTypeEnum.EMAIL, businessId });
			if (!regData.status) return errorResponse(res, 'An error occured');
			await sendNotificationMail(MailType.REG_SUCCESS, { name: names.split(' ')[0], email });
			return successResponse(res, `Registration successfull`, regData.data);
		} else {
			return handleResponse(res, 401, false, `An error occured`);
		}
	} catch (error) {
		console.log(error);
		return handleResponse(res, 401, false, `An error occured - ${error}`);
	}
};

export const activate = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const { email, phone, businessId } = req.body;

	try {
		const staff: any = await DB.staffs.findOne({
			where: { [Op.or]: [{ email }, { phone }], businessId },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		});

		if (!staff) return errorResponse(res, `staff with email ${email}  or phone ${phone} not found!`);

		// if staff exists, stop the process and return a message
		if (staff.status === 'active')
			return handleResponse(res, 400, false, `staff with email ${email}  or phone ${phone} already activated, please signin`);

		await DB.staffSettings.create({ staffId: staff.id });
		const regData = await sendOtp({ channel: staff.email, type: typeEnum.VERIFICATION, channelType: channelTypeEnum.EMAIL, businessId });
		if (!regData.status) return errorResponse(res, `An error occured:- ${regData.message}`);
		// await sendNotificationMail(MailType.REG_SUCCESS, { name: staff.firstName + staff.lastName, email: staff.email });
		return successResponse(res, `OTP sent!`, regData.data);
	} catch (error) {
		console.log(error);
		return handleResponse(res, 401, false, `An error occured - ${error}`);
	}
};

export const preLogin = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const { email, phone, password, businessId } = req.body;
	if (!phone && !email) return errorResponse(res, `Email or Phone is required`);
	try {
		const business = await DB.businesses.findOne({ where: { id: businessId } });
		if (!business) return errorResponse(res, `Business with code ${businessId} not found!`);
		const staff = await DB.staffs.findOne({ where: { [Op.or]: [{ email }, { phone }], businessId } });
		console.log(staff);

		if (staff) {
			if (staff.status === 'pending') return errorResponse(res, 'Account pending activation, please activate your account!');
			if (staff.status === 'suspended') return errorResponse(res, 'Account suspended, please contact your employer!');
			const staffData = {
				password: staff.password,
				id: staff.id,
				email: staff.email,
				firstName: staff.firstName,
				lastName: staff.lastName,
				otherName: staff.otherName,
				phone: staff.phone,
				status: staff.status,
				businessId: staff.businessId,
				businessName: business.name,
			};
			const loginResponse: FnResponseDataType = await login({ email: staff.email, password, staff: staffData });
			if (!loginResponse.status) return errorResponse(res, loginResponse.message);
			return successResponse(res, loginResponse.message, loginResponse.data);
		} else {
			return handleResponse(res, 401, false, `Incorrect Credentials`);
		}
	} catch (error) {
		console.log(error);
		return handleResponse(res, 401, false, `An error occured - ${error}`);
	}
};

export const getStaffData = async (req: Request, res: Response) => {
	try {
		const { staff } = req;
		return successResponse(res, `staff data retrived!`, staff);
	} catch (error) {
		console.log(error);
		return handleResponse(res, 401, false, `An error occured - ${error}`);
	}
};

export const resendOtp = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorResponse(res, 'Validation Error', errors.array());

	const { email, phone, type, businessId } = req.body;
	try {
		const staff = await DB.staffs.findOne({
			where: { [Op.or]: [{ email }, { phone }] },
			include: { model: DB.businesses, where: { lukaId: businessId } },
		});
		if (!staff) return errorResponse(res, `Staff not found!`);
		if (staff.status === StaffStatus.SUSPENDED) return errorResponse(res, 'Staff suspended!');
		const otpType = type === typeEnum.VERIFICATION ? typeEnum.VERIFICATION : type === typeEnum.TWOFA ? typeEnum.TWOFA : typeEnum.RESET;
		const regData = await sendOtp({ channel: staff.email, type: otpType, channelType: channelTypeEnum.EMAIL, businessId: staff.business.id });
		if (!regData.status) return errorResponse(res, 'An error occured');
		return successResponse(res, `Successfull`, regData.data);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const createPassword = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorResponse(res, 'Validation Error', errors.array());

	const { password } = req.body;
	console.log('staff data', req.staff);
	const { email, businessId } = req.staff;
	try {
		const staff = await DB.staffs.findOne({ where: { email, businessId, status: 'active' }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
		if (staff.status === StaffStatus.SUSPENDED) return errorResponse(res, `Staff suspended!`);
		const salt: string = await bcrypt.genSalt(15);
		const hashPassword: string = await bcrypt.hash(password, salt);
		const updatedPassword: any = await staff.update({ password: hashPassword });
		return successResponse(res, `Password created successfully`);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const updatePassword = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorResponse(res, 'Validation Error', errors.array());

	const { email, oldPassword, newPassword } = req.body;
	try {
		const staff = await DB.staffs.findOne({ where: { email, status: 'active' }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
		if (!staff) return errorResponse(res, `staff not found!`);
		const validPassword: boolean = await bcrypt.compareSync(oldPassword, staff.password);
		if (!validPassword) return errorResponse(res, `Incorrect  old password!`);
		const salt: string = await bcrypt.genSalt(15);
		const hashPassword: string = await bcrypt.hash(newPassword, salt);
		const updatedPassword: any = await staff.update({ password: hashPassword });
		if (!updatedPassword) return errorResponse(res, `Unable update password!`);
		return successResponse(res, `Password updated successfully`);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const resetPassword = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}

	const { email, businessId } = req.body;

	try {
		const staff = await DB.staffs.findOne({
			where: { email, businessId },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		});

		if (!staff) return handleResponse(res, 401, false, `Incorrect Email`);
		const sendOtpResponse: FnResponseDataType = await sendOtp({
			channel: email,
			type: typeEnum.RESET,
			channelType: channelTypeEnum.EMAIL,
			businessId,
		});
		if (!sendOtpResponse.status) return errorResponse(res, sendOtpResponse.message);
		return successResponse(res, sendOtpResponse.message, sendOtpResponse.data);
	} catch (error) {
		console.log(error);
		return handleResponse(res, 401, false, `An error occured - ${error}`);
	}
};

export const changePassword = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorResponse(res, 'Validation Error', errors.array());
	const { token, password }: ChangePasswordDataType = req.body;

	try {
		const decoded: any = jwt.verify(token, config.JWTSECRET);
		if (!decoded) return errorResponse(res, `Invalid verification`);

		const staff = await DB.staffs.findOne({
			where: { email: decoded.client, status: 'active' },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
		});
		if (!staff) return errorResponse(res, `Account Suspended!, Please contact support!`);
		const salt: string = await bcrypt.genSalt(15);
		const hashPassword: string = await bcrypt.hash(password, salt);
		const updatedPassword: any = await staff.update({ password: hashPassword });
		if (!updatedPassword) return errorResponse(res, `Unable update password!`);
		return successResponse(res, `Password changed successfully`);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const verifyOtp = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	try {
		var currentdate = new Date();
		const { token, otp, client, type }: VerifyOtpDataType = req.body;
		const decoded: any = jwt.verify(token, config.JWTSECRET);
		if (!decoded) return errorResponse(res, `Invalid verification`);

		if (decoded.client != client) return errorResponse(res, `OTP was not sent to this particular email`);

		const otpInstance = await DB.otp.findOne({ where: { id: decoded.otpId } });

		if (!otpInstance) return errorResponse(res, `OTP does not exists`);
		if (otpInstance.verified) return errorResponse(res, `OTP Already Used`);
		if (!otpValidity(otpInstance.expirationTime, currentdate)) return errorResponse(res, 'OTP Expired');
		if (otp != otpInstance.otp) return errorResponse(res, 'OTP NOT Matched');

		const updateData = { verified: true, verifiedAt: currentdate };
		await otpInstance.update(updateData);

		if (type === typeEnum.TWOFA) {
			// const loginResponse: FnResponseDataType = await login({ email: client, password: decoded.password, });
			// if (!loginResponse.status) return errorResponse(res, loginResponse.message);
			// return successResponse(res, 'Login Successful', loginResponse.data);
			return successResponse(res, 'success');
		} else if (type === typeEnum.RESET) {
			if (decoded.password) return errorResponse(res, 'Suspicious attempt discovered! Pls reset password again');
			return successResponse(res, 'OTP Matched', token);
		} else {
			const accountActivated = await activateAccount(client, decoded.businessId);
			if (!accountActivated.status) return errorResponse(res, accountActivated.message);
			// Create and assign token
			const { id, email, firstName, lastName, otherName, phone, status, businessId, businessName } = accountActivated.data;
			let payload: AuthPayloadDataType = {
				id,
				email,
				firstName,
				lastName,
				otherName,
				phone,
				status,
				businessId,
				businessName,
				type: 'staff',
			};
			const encodedToken: string = jwt.sign(payload, config.JWTSECRET);
			const data: TokenDataType = { type: 'token', token: encodedToken, staff: payload };
			return successResponse(res, 'Email verified', data);
		}
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const setTransPin = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return errorResponse(res, 'Validation Error', errors.array());

	const { pin } = req.body;
	const { businessId, email } = req.staff;
	try {
		const staff = await DB.staffs.findOne({ where: { email, businessId, status: 'active' }, attributes: { exclude: ['createdAt', 'updatedAt'] } });
		if (!staff) return errorResponse(res, `staff not found!`);
		const salt: string = await bcrypt.genSalt(15);
		const hashPin: string = await bcrypt.hash(pin, salt);
		const updatedPin: any = await staff.update({ pin: hashPin });
		if (!updatedPin) return errorResponse(res, `Unable to create pin!`);
		return successResponse(res, `Pin created successfully`);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const updateStaffSettings = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { twoFa } = req.body;
	const { id } = req.user;

	try {
		const user = await DB.users.findOne({ where: { id } });
		const updatedSettings: any = await user.update({ twoFa });
		if (!updatedSettings) return errorResponse(res, `Unable update settings!`);
		return successResponse(res, `Settings updated successfully`);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const updateStaffProfile = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { names, email, phone } = req.body;
	const { id } = req.user;

	try {
		const user = await DB.users.findOne({ where: { id } });
		const emailOrPhoneExists = await DB.users.findAll({ where: { [Op.or]: [{ email }, { phone }] } });
		if (emailOrPhoneExists.length > 1) return errorResponse(res, `email or phone already registered with another user`);
		const updateData = {
			names: names || user.names,
			email: email === user.email ? email : !email ? user.email : user.email,
			phone: phone === user.phone ? phone : !phone ? user.phone : user.phone,
		};
		const updatedProfile: any = await user.update(updateData);
		if (!updatedProfile) return errorResponse(res, `Unable to update profile!`);
		return successResponse(res, `Profile updated successfully`);
	} catch (error) {
		console.log(error);
		return errorResponse(res, `An error occured - ${error}`);
	}
};

export const getUserBusinesses = async (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return errorResponse(res, 'Validation Error', errors.array());
	}
	const { email, phone } = req.body;

	// try {
	// 	const staff = await DB.staffs.findOne({ where: { [Op.or]: [{ email }, { phone }] }, include:{model: DB.business} });
	// 	const emailOrPhoneExists = await DB.users.findAll({ where: { [Op.or]: [{ email }, { phone }] } });
	// 	if (emailOrPhoneExists.length > 1) return errorResponse(res, `email or phone already registered with another user`);
	// 	const updateData = {
	// 		names: names || user.names,
	// 		email: email === user.email ? email : !email ? user.email : user.email,
	// 		phone: phone === user.phone ? phone : !phone ? user.phone : user.phone,
	// 	};
	// 	const updatedProfile: any = await user.update(updateData);
	// 	if (!updatedProfile) return errorResponse(res, `Unable to update profile!`);
	// 	return successResponse(res, `Profile updated successfully`);
	// } catch (error) {
	// 	console.log(error);
	// 	return errorResponse(res, `An error occured - ${error}`);
	// }
};
