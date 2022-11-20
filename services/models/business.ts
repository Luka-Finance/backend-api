import { prepareMail } from './../mailer/mailer';
import { forgetPasswordTemplateData } from './../mailer/templateData';
import { mailTemplate } from './../mailer/template';
import { otpValidity } from './../../helpers/utility';

import { sendOtp, activateAccount } from './../../helpers/auth';
import bcrypt from 'bcryptjs';
import {
	BusinessType,
	BusinessLoginType,
	TokenDataType,
	typeEnum,
	FnResponseDataType,
	channelTypeEnum,
	VerifyOtpDataType,
	resendOtpType,
} from './../../helpers/types';
import { fnResponse, generateTransactionNarration, getDailyAccuredInterest, randId, sendNotificationMail } from '../../helpers/utility';
import DB from '../../controllers/db';
import { Transaction } from './transactions';
import { MailType, NarrationType, TransactionGateway, TransactionStatus, TransactionType } from '../../helpers/types';
import jwt from 'jsonwebtoken';
import config from '../../config/configSetup';
import { Op } from 'sequelize';
import moment from 'moment';
import axios from 'axios';
import { SeerBit } from '../seerbit';

export class Business {
	randomId(name: string) {
		const prefix = 'LUKA';

		const rand = Math.random().toString(36).slice(2, 7);
		const lukaId = `${prefix}-${name.substring(0, 3).toUpperCase()}-${rand}`;

		return lukaId;
	}

	public async create(businessDetails: BusinessType) {
		try {
			// 		const employerExist: any = await DB.businesses.findOne({
			// 	where: { [Op.or]: [{ businessDetails.email }, { businessDetails.phone }] },
			// 	attributes: { exclude: ['createdAt', 'updatedAt'] },
			// });

			const businessExist: any = await DB.businesses.findOne({
				where: { [Op.or]: [{ email: businessDetails.email }, { phone: businessDetails.phone }] },
				attributes: { exclude: ['createdAt', 'updatedAt'] },
			});

			if (businessExist) return fnResponse({ status: false, message: `Business already exist!` });

			const { password, ...rest } = businessDetails;
			const salt: string = await bcrypt.genSalt(15);
			const hashPassword: string = await bcrypt.hash(password, salt);
			const lukaId = this.randomId(rest.name);

			const accountData = {
				fullName: businessDetails.name,
				currency: 'NGN',
				country: 'NG',
				reference: `LUKA-${lukaId}`,
				email: businessDetails.email,
			};
			const virtualAccountData = await new SeerBit().virtualAccount(accountData);
			if (virtualAccountData.status !== 'SUCCESS') return fnResponse({ status: false, message: `Error in creaating virtual account` });
			const { reference, walletName, bankName, accountNumber } = virtualAccountData.data.payments;
			let insertData: BusinessType = {
				...rest,
				password: hashPassword,
				lukaId,
				virtualAccountData: { reference, walletName, bankName, accountNumber },
			};

			const { id } = await DB.businesses.create({ ...insertData });

			const sendOtpResponse: FnResponseDataType = await sendOtp({
				channel: rest.email,
				type: typeEnum.VERIFICATION,
				channelType: channelTypeEnum.EMAIL,
				businessId: id,
			});

			return fnResponse({
				status: true,
				message: `Business successfully created!`,
				data: {
					otp: { ...sendOtpResponse },
				},
			});
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async resendOtp(body: resendOtpType) {
		try {
			const business: any = await DB.businesses.findOne({
				where: { [Op.or]: [{ email: body.email }, { phone: body.phone }] },
				attributes: { exclude: ['createdAt', 'updatedAt'] },
			});
			if (!business) return fnResponse({ status: false, message: `Business not found` });

			const sendOtpResponse: FnResponseDataType = await sendOtp({
				channel: business.email,
				type: body.type,
				channelType: channelTypeEnum.EMAIL,
				businessId: business.id,
			});

			return fnResponse({
				status: true,
				data: {
					otp: { ...sendOtpResponse },
				},
				message: `Otp resent successfully!`,
			});
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async verifyOtp(body: VerifyOtpDataType) {
		try {
			var currentdate = new Date();
			const { token, otp, client, type }: VerifyOtpDataType = body;
			const decoded: any = jwt.verify(token, config.JWTSECRET);
			if (!decoded) return fnResponse({ status: false, message: `Invalid token!` });

			if (decoded.client != client) return fnResponse({ status: false, message: `OTP was not sent to this particular email` });

			const otpInstance = await DB.otp.findOne({ where: { id: decoded.otpId } });

			if (!otpInstance) return fnResponse({ status: false, message: `OTP does not exists` });
			if (otpInstance.verified) return fnResponse({ status: false, message: `OTP has already been verified` });
			if (!otpValidity(otpInstance.expirationTime, currentdate)) return fnResponse({ status: false, message: `OTP has expired` });
			if (otp != otpInstance.otp) return fnResponse({ status: false, message: `OTP is incorrect` });

			const updateData = { verified: true, verifiedAt: currentdate };
			await otpInstance.update(updateData);
			// const loginResponse: FnResponseDataType = await login({ email: client, password: decoded.password, });
			// if (!loginResponse.status) return errorResponse(res, loginResponse.message);
			// return successResponse(res, 'Login Successful', loginResponse.data);

			const business = await DB.businesses.findOne({ where: { id: decoded.businessId } });

			if (!business) return fnResponse({ status: false, message: `Business not found` });

			const updateBusiness = { verifiedAt: currentdate };
			await business.update(updateBusiness);

			return fnResponse({ status: true, message: `OTP verified successfully!` });
		} catch (error) {
			console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async login(businessLoginDetails: BusinessLoginType) {
		try {
			const { email, password } = businessLoginDetails;
			const business = await DB.businesses.findOne({ where: { email } });
			if (!business) return fnResponse({ status: false, message: `Business with email ${email} not found!` });
			const { password: hashPassword, ...rest } = business.dataValues;
			const payload = { data: { ...rest }, type: 'employer' };

			const isMatch: boolean = await bcrypt.compare(password, hashPassword);

			if (!isMatch) return fnResponse({ status: false, message: `Wrong password!` });

			const token: string = jwt.sign(payload, config.JWTSECRET);

			const data = { type: 'token', token, business: payload.data };

			return fnResponse({ status: true, message: `Business successfully logged in!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll() {
		try {
			const data = await DB.businesses.findAll();
			if (!data.length) return fnResponse({ status: true, message: `No business available!`, data });
			return fnResponse({ status: true, message: `${data.length} business${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne(id: string) {
		try {
			const data = await DB.businesses.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Business with id ${id} not found!` });
			return fnResponse({ status: true, message: `Business retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getStats(id: string) {
		try {
			const totalEarnedThisMonth = await DB.businessTransactions.sum('amount', {
				where: {
					[Op.and]: [
						{ businessId: id },
						{ status: 'success' },
						{ createdAt: { [Op.gte]: moment().startOf('month').toDate() } },
						{ createdAt: { [Op.lte]: moment().endOf('month').toDate() } },
					],
				},
			});
			const totalWithdrawn = await DB.businessTransactions.sum('amount', {
				where: {
					[Op.and]: [{ businessId: id }, { status: 'success' }, { type: 'withdrawal' }],
				},
			});
			const pendingBalance = await DB.businessTransactions.sum('amount', {
				where: {
					[Op.and]: [{ businessId: id }, { status: 'pending' }, { type: 'withdrawal' }],
				},
			});
			const totalStaff = await DB.staffs.count({ where: { businessId: id } });
			const activeStaffs = await DB.staffs.count({ where: { [Op.and]: [{ businessId: id }, { status: 'active' }] } });
			const inactiveStaffs = await DB.staffs.count({ where: { [Op.and]: [{ businessId: id }, { status: 'suspended' }] } });

			const data = {
				totalEarnedThisMonth,
				totalWithdrawn,
				pendingBalance,
				totalStaff,
				activeStaffs,
				inactiveStaffs,
			};

			if (!data) return fnResponse({ status: false, message: `Stats for business with id ${id} not found!` });
			return fnResponse({ status: true, message: `Business stats retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, name }: { id: string; name: string }) {
		try {
			const docData = await DB.businesses.findOne({ where: { id } });
			if (!docData) return fnResponse({ status: false, message: `Business with id ${id} not found!` });
			const updateData = { name };
			await docData.update(updateData);
			return fnResponse({ status: true, message: `Business successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: string) {
		try {
			const data = await DB.businesses.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Business with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Business successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async updateBusiness(id: string, businessDetails: BusinessType) {
		try {
			const docData = await DB.businesses.findOne({ where: { id } });
			if (!docData) return fnResponse({ status: false, message: `Business with id ${id} not found!` });

			await docData.update({ ...businessDetails });
			return fnResponse({ status: true, message: `Business successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async verifyBusiness(type: string, doc: object) {
		try {
			axios
				.post(
					config.VERIFIED_AFRICA_URL,
					{
						...doc,
						verificationType: type == 'rc' ? 'RC-VERIFICATION' : 'TIN-FULL-DETAIL-VERIFICATION',
					},
					{
						headers: {
							userid: config.VERIFIED_AFRICA_USERID,
							apiKey: config.VERIFIED_AFRICA_API_KEY,
						},
					}
				)
				.then((response) => {
					console.log(response);
					return fnResponse({ status: true, message: `Business data verified!` });
				})
				.catch((error) => {
					return fnResponse({ status: false, message: `An error occured - ${error}` });
				});

			return fnResponse({ status: true, message: `Business successfully verified!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async me(id: string) {
		try {
			const data = await DB.businesses.findByPk(id, {
				attributes: {
					exclude: 'password',
				},
			});
			if (!data) return fnResponse({ status: false, message: `Business with id ${id} not found!` });

			return fnResponse({ status: true, message: `Business retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async forgetPassword(email: string) {
		try {
			const data = await DB.businesses.findOne({ where: { email } });
			if (!data) return fnResponse({ status: false, message: `Business with email ${email} not found!` });

			const token = jwt.sign({ id: data.id }, config.JWTSECRET, { expiresIn: '10m' });

			const { mailSubject, mailBody } = forgetPasswordTemplateData(token);

			await prepareMail({
				mailRecipients: email,
				mailSubject,
				mailBody: mailTemplate({ subject: mailSubject, body: mailBody }),
				senderName: config.MAIL_FROM_NAME,
				senderEmail: config.MAIL_FROM,
			});

			return fnResponse({ status: true, message: `Password reset link sent to ${email}!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async resetPassword(token: string, password: string) {
		try {
			const decoded = jwt.verify(token, config.JWTSECRET) as any;
			const data = await DB.businesses.findOne({ where: { id: decoded.id } });
			if (!data) return fnResponse({ status: false, message: `Business with id ${decoded.id} not found!` });

			const hashedPassword = await bcrypt.hash(password, 10);
			await data.update({ password: hashedPassword });

			return fnResponse({ status: true, message: `Password successfully reset!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async updatePassword(id: string, oldPassword: string, newPassword: string) {
		try {
			const data = await DB.businesses.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Business with id ${id} not found!` });

			const isMatch = await bcrypt.compare(oldPassword, data.password);
			if (!isMatch) return fnResponse({ status: false, message: `Incorrect password!` });

			const hashedPassword = await bcrypt.hash(newPassword, 10);
			await data.update({ password: hashedPassword });

			return fnResponse({ status: true, message: `Password successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getPaymentHistory(id: string) {
		try {
			const data = await DB.businesses.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Business with id ${id} not found!` });

			const paymentHistory = await DB.businessTransactions.findAll({ where: { businessId: id } });

			return fnResponse({ status: true, message: `Payment history retrieved!`, data: paymentHistory });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getInvoices(id: string) {
		try {
			const data = await DB.invoices.findAll({ where: { businessId: id } });
			if (!data.length) return fnResponse({ status: true, message: `No Invoices available!`, data });
			return fnResponse({ status: true, message: `${data.length} Invoice${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
