import { convertArrayToCSV } from 'convert-array-to-csv';

import { InvoicesDataType, MailType, NarrationType, TransactionGateway, TransactionStatus, TransactionType } from '../helpers/types';
import { addDays, fnResponse, generateTransactionNarration, getDailyAccuredInterest, randId, sendNotificationMail } from '../helpers/utility';
import DB from '../controllers/db';
import { Transaction } from './models/transactions';
import { Wallet } from './models/wallets';
import { Invoice } from './models/invoices';
import moment from 'moment';

export class Cron {
	public async creditDailyInterest() {
		try {
			const staffs = await DB.staffs.findAll({
				attributes: ['id', 'email', 'salary', 'firstName', 'businessId'],
				include: { model: DB.staffWallets, attributes: ['balance'] },
			});
			// console.log(staffs);
			staffs.forEach(
				async (staff: { id: number; salary: number; firstName: string; email: string; businessId: number; staffWallet: { balance: number } }) => {
					const interestBalance = Number(getDailyAccuredInterest(staff.salary));
					// update
					// await DB.sequelize.query(`UPDATE staffWallets SET balance = (staffWallets.balance + ${interestBalance}) WHERE staffId = ${staff.id}`);
					const walletUpdate = await new Wallet().update({ staffId: staff.id, balance: interestBalance, type: TransactionType.CREDIT });
					console.log({ walletUpdate });
					await new Transaction().create({
						ref: `ref-${randId()}`,
						transId: randId(),
						amount: Number(getDailyAccuredInterest(staff.salary)),
						commission: 0.0,
						narration: generateTransactionNarration(NarrationType.DAILY_INTEREST),
						gateway: TransactionGateway.LUKA,
						type: TransactionType.CREDIT,
						status: TransactionStatus.SUCCESS,
						businessId: staff.businessId,
						staffId: staff.id,
					});
					await sendNotificationMail(MailType.DAILY_INTEREST, {
						name: staff.firstName,
						email: staff.email,
						amount: interestBalance,
						balance: Number((staff.staffWallet.balance + interestBalance).toFixed(2)),
					});
				}
			);
		} catch (error) {
			console.log(`An error occured - ${error}`);
		}
	}

	public async resetInterest() {
		try {
			const businesses = await DB.businesses.findAll({
				// where: { payday: new Date().getDate() },
				attributes: ['id', 'name', 'email', 'payday'],
				include: { model: DB.staffs, attributes: ['id', 'email', 'firstName'] },
			});
			businesses.forEach(
				async (business: { id: number; name: string; email: string; payday: number; staffs: { id: number; email: string; firstName: string }[] }) => {
					// reset
					await new Wallet().reset(business.id);
					const { data } = await this.generateInvoice(business.id);
					const invoice: {
						id: number;
						title: string;
						total: number;
						dueDate: string;
						createdAt: string;
						items: { amount: number; description: string }[];
					} = {
						id: data.createdInvoice.id,
						title: data.createdInvoice.title,
						total: Number(data.createdInvoice.total.toFixed(2)),
						dueDate: data.createdInvoice.dueDate,
						createdAt: data.createdInvoice.createdAt,
						items: data.createdInvoice.items,
					};

					console.log('invoice data', invoice);

					// send reset notification to the selected businesses
					await sendNotificationMail(MailType.BUSINESS_INVOICE, {
						name: business.name,
						email: business.email,
						invoice,
						// attachment: data.spendings
						// 	? [
						// 			{
						// 				content: convertArrayToCSV(data.spendings),
						// 				filename: `${data.title}.csv`,
						// 				type: 'text/csv',
						// 				disposition: 'attachment',
						// 			},
						// 	  ]
						// 	: null,
					});

					business.staffs.forEach(async (staff) => {
						// send reset notification to all staffs of of the selected business
						await sendNotificationMail(MailType.STAFF_WALLET_RESET, {
							name: staff.firstName,
							email: staff.email,
							businessName: business.name,
							csv: '',
						});
					});
				}
			);
		} catch (error) {
			console.log(`An error occured - ${error}`);
		}
	}

	public async generateInvoice(businessId: number) {
		const month = ['Januanry', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		const title: string = `Staff Spend for ${month[new Date().getMonth() - 1]}`;
		try {
			const transaction = new Transaction();
			const businessTransactionsTotal = await transaction.sumAllTransactionsByBusinnessId(businessId, null);
			const items: { amount: number; description: string }[] = [{ amount: Number(businessTransactionsTotal.data.toFixed(2)), description: title }];
			const createdInvoice = await new Invoice().create({
				title,
				total: businessTransactionsTotal.data,
				items,
				dueDate: addDays(new Date(), 3),
				businessId,
			});
			const { data } = await transaction.updateWithInvoiceId(createdInvoice.data.id, businessId);
			const formatedData = data.map(
				(trans: {
					transId: string;
					amount: number;
					narration: string;
					createdAt: Date;
					staff: { firstName: string; lastName: string; email: string };
				}) => {
					return {
						'Transaction ID': trans.transId,
						Amount: trans.amount,
						Narration: trans.narration,
						Date: moment(trans.createdAt).format('LL'),
						Name: `${trans.staff.firstName} ${trans.staff.lastName}`,
						Email: trans.staff.email,
					};
				}
			);
			return fnResponse({
				status: true,
				message: `Invoice Generated`,
				data: { title, spendings: formatedData, createdInvoice: createdInvoice.data },
			});
		} catch (error) {
			console.log(`An error occured - ${error}`);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
