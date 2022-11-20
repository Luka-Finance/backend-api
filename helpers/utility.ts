import { Request, Response } from 'express';
import { BookingType, BuildItUserDataType, FnResponseDataType, MailType, NarrationType } from './types';
import DB from '../controllers/db';
import config from '../config/configSetup';
import { getNotificationTemplateData } from '../services/mailer/templateData';
import { prepareMail } from '../services/mailer/mailer';
import { mailTemplate } from '../services/mailer/template';

export const handleResponse = (res: any, statusCode: number, status: boolean, message: string, data?: any) => {
	return res.status(statusCode).json({
		status,
		message,
		data,
	});
};

export const successResponse = (res: any, message: string = 'Operation successfull', data?: any) => {
	return res.status(200).json({
		status: true,
		message,
		data,
	});
};

export const errorResponse = (res: any, message: string = 'An error occured', data?: any) => {
	return res.status(400).json({
		status: false,
		message,
		data,
	});
};

export const fnResponse = ({ status, message, data }: FnResponseDataType) => {
	return { status, message, data };
};

export const generateOtp = (length: number = 4) => {
	return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
};

export const addMinutesToDate = (date: Date, minutes: number) => {
	return new Date(date.getTime() + minutes * 60000);
};

export const otpValidity = (a: Date, b: Date) => {
	if (a.getTime() > b.getTime()) return true;
	return false;
};

export const randId = () => Math.floor(Math.random() * 100000000000 + 1).toString(16);

export const generateRequestId = () => {
	const date = new Date();
	let timestamp;
	timestamp = date.getFullYear().toString(); // 2011
	timestamp += (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1).toString(); // JS months are 0-based, so +1 and pad with 0's
	timestamp += (date.getDate() < 10 ? '0' : '') + date.getDate().toString(); // pad with a 0
	timestamp += (date.getHours() < 10 ? '0' : '') + date.getHours().toString(); // pad with a 0
	timestamp += (date.getMinutes() < 10 ? '0' : '') + date.getMinutes().toString(); // pad with a 0
	timestamp += (date.getSeconds() < 10 ? '0' : '') + date.getSeconds().toString(); // pad with a 0
	timestamp += (date.getMilliseconds() < 10 ? '0' : '') + date.getMilliseconds().toString(); // pad with a 0
	return timestamp;
};

export const generateTransactionNarration = (narrationType: NarrationType): string =>
	`Luka | ${narrationType === NarrationType.DAILY_INTEREST ? 'Daily accured wages' : 'Regular Spend'}`;

export const getIdentity = (req: Request) => {
	const parameter: { identity?: 'staff' | 'admin' | undefined; id?: number; businessId?: number } = {};
	// console.log(req.user);
	if (req.staff || req.user) {
		parameter.identity = 'staff';
		parameter.id = req.staff ? req.staff.id : req.user.data.id;
		parameter.businessId = req.staff ? req.staff.businessId : req.user.data.id;
	} else {
		parameter.identity = 'admin';
	}
	return parameter;
};

export const saveUserCard = async (data: any) => {
	const insertCardData = {
		type: data.card.type,
		token: data.card.token,
		first6: data.card.first_6digits,
		last4: data.card.last_4digits,
		bank: data.card.issuer,
		gateway: 'flutterwave',
		userId: data.meta.userId,
	};
	const { first6, last4, userId } = insertCardData;
	try {
		const cardExists = await DB.cards.findOne({ where: { first6, last4, userId } });
		console.log('card', cardExists);
		if (!cardExists) {
			await DB.cards.create(insertCardData);
		}
	} catch (error) {
		console.log(error);
	}
};

export const validateObject = (obj: any) => {
	for (var key in obj) {
		if (obj[key] == null || obj[key] == '') return false;
	}
	return true;
};

export const validateData = (data: string | number, type: 'string' | 'number') => {
	if (typeof data == type && data != '') {
		if (type == 'number' && isNaN(Number(data))) {
			// validateDataErrorMsg(data,type,resource,errorArr,config,rowData);
			return false;
		}
		return data;
	}
	// validateDataErrorMsg(data,type,resource,errorArr,config,rowData);
	return false;
};

export const getDateDifferenceInMinutes = (date1: any, date2: any) => {
	const diffTime = Math.abs(date2 - date1);
	return Math.ceil(diffTime / (1000 * 60));
};

export const addDays = (date: Date, days: number) => {
	let result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
};

export const sendNotificationMail = async (type: MailType, receiver: any) => {
	// get mail template
	const { mailSubject, mailBody }: any = getNotificationTemplateData({ data: receiver, type });

	// prepare and send mail
	const sendEmail = await prepareMail({
		mailRecipients: receiver.email,
		mailSubject,
		mailBody: mailTemplate({ subject: mailSubject, body: mailBody }),
		senderName: config.MAIL_FROM_NAME,
		senderEmail: config.MAIL_FROM,
	});

	if (sendEmail.status) return fnResponse({ status: true, message: 'Notification email sent!' });
	return fnResponse({ status: false, message: 'Notification email not sent!' });
};

export const getDailyAccuredInterest = (staffSalary: number) => ((Number(staffSalary) * 0.5) / 30).toFixed(2);
