// Import packages
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Import DB and configs
import DB from '../controllers/db';
import config from '../config/configSetup';

// Import types & function files
import { SendOtpDataType, OtpDetailsDataType, LoginDataType, AuthPayloadDataType, TokenDataType, channelTypeEnum } from './types';
import { generateOtp, addMinutesToDate, fnResponse } from './utility';
import { getOtpTemplateData } from '../services/mailer/templateData';
import { prepareMail } from '../services/mailer/mailer';
import { mailTemplate } from '../services/mailer/template';
import { getSmsOtpTemplateData } from '../services/sms/templateData';
import { prepareSms } from '../services/sms/sms';

export const sendOtp = async ({ channel, type, channelType, businessId }: SendOtpDataType) => {
	try {
		//Generate OTP
		const otp: number = generateOtp(),
			now: Date = new Date(),
			expirationTime: Date = addMinutesToDate(now, 10);

		const otpInstance = await DB.otp.create({ otp, expirationTime });

		// Create details object containing the email and otp id
		const otpDetails: OtpDetailsDataType = {
			timestamp: now,
			client: channel,
			success: true,
			message: 'OTP sent to user',
			otpId: otpInstance.id,
			businessId,
		};

		// Encrypt the details object
		const encoded: string = jwt.sign(JSON.stringify(otpDetails), config.JWTSECRET);

		if (channelType === channelTypeEnum.EMAIL) {
			const { mailSubject, mailBody } = getOtpTemplateData({ otp, type });

			// prepare and send mail
			const sendEmail = await prepareMail({
				mailRecipients: channel,
				mailSubject,
				mailBody: mailTemplate({ subject: mailSubject, body: mailBody }),
				senderName: config.MAIL_FROM_NAME,
				senderEmail: config.MAIL_FROM,
			});

			if (sendEmail.status) return fnResponse({ status: true, message: 'OTP Sent', data: encoded });
			return fnResponse({ status: false, message: 'OTP not sent' });
		} else {
			const { smsBody } = getSmsOtpTemplateData({ otp, type });
			const sendSms = await prepareSms({ phone: channel, text: smsBody });
			if (sendSms.status) return fnResponse({ status: true, message: 'OTP Sent', data: encoded });
			return fnResponse({ status: false, message: 'OTP not sent' });
		}
	} catch (error: any) {
		console.log(error);
		return fnResponse({ status: false, message: `An error occured:- ${error}` });
	}
};

export const login = async ({ email, password, staff }: LoginDataType) => {
	try {
		const validPass: boolean = await bcrypt.compareSync(password, staff.password);
		if (!validPass) return fnResponse({ status: false, message: 'Email or Password is incorrect!' });

		if (staff.status === 'inactive') return fnResponse({ status: false, message: 'Account pending activation!, Please contact support!' });

		// Create and assign token
		let payload: AuthPayloadDataType = {
			id: Number(staff.id),
			email,
			firstName: staff.firstName,
			lastName: staff.lastName,
			otherName: staff.otherName,
			phone: staff.phone,
			status: staff.status,
			businessId: staff.businessId,
			type: 'staff',
		};
		const token: string = jwt.sign(payload, config.JWTSECRET);
		const data: TokenDataType = { type: 'token', token, staff: payload };
		return fnResponse({ status: true, message: 'Login successfull', data });
	} catch (error) {
		console.log(error);
		return fnResponse({ status: false, message: `An error occured - ${error}` });
	}
};

export const activateAccount = async (email: string, businessId: number) => {
	try {
		const staff = await DB.staffs.findOne({
			where: { email, businessId },
			attributes: { exclude: ['createdAt', 'updatedAt'] },
			include: { model: DB.businesses, attributes: ['id', 'name'] },
		});
		await staff.update({ status: 'active' });
		const data = {
			id: staff.id,
			email: staff.email,
			firstName: staff.firstName,
			lastName: staff.lastName,
			otherName: staff.otherName,
			phone: staff.phone,
			status: staff.status,
			businessId,
			businessName: staff.business.name,
			// accountDetails: user.accountDetails,
		};
		return fnResponse({ status: true, message: 'Staff Activated', data });
	} catch (error) {
		console.log(error);
		return fnResponse({ status: false, message: `An error occured - ${error}` });
	}
};
