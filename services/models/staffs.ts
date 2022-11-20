import { StaffAccountMode, StaffRegisterType } from './../../helpers/types';
import { fnResponse, generateTransactionNarration, getDailyAccuredInterest, randId, sendNotificationMail } from '../../helpers/utility';
import DB from '../../controllers/db';
import config from '../../config/configSetup';
import { MailType, NarrationType, TransactionGateway, TransactionStatus, TransactionType } from '../../helpers/types';
import { SeerBit } from '../seerbit';
import { Wallet } from './wallets';

export class Staff {
	public async create(staffDetails: StaffRegisterType) {
		const { email, phone, businessId, lastName, firstName } = staffDetails;
		try {
			// const rand = Math.random().toString(36).slice(2, 7);
			// const password = `LUKA-${rand}`;
			// const pin = Math.floor(1000 + Math.random() * 9000);

			const business = await DB.businesses.findOne({ where: { id: businessId } });
			if (!business) return fnResponse({ status: false, message: `Business not found!` });
			const staffExists = await DB.staffs.findOne({
				where: {
					[DB.Sequelize.Op.or]: [{ email }, { phone }],
					businessId: businessId,
				},
			});

			if (staffExists) return fnResponse({ status: false, message: `Staff with email or phone already exists!` });

			const staff = await DB.staffs.create(staffDetails);
			await new Wallet().create({ businessId: Number(businessId), staffId: staff.id });
			await sendNotificationMail(MailType.REG_SUCCESS, {
				name: staffDetails.firstName,
				email: staffDetails.email,
				business: {
					name: business.name,
					lukaId: business.lukaId,
				},
			});
			return fnResponse({ status: true, message: `Staff created!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll() {
		try {
			const data = await DB.staffs.findAll();
			if (!data.length) return fnResponse({ status: true, message: `No staff available!`, data });
			return fnResponse({ status: true, message: `${data.length} staff${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne(id: number) {
		const include: any = [{ model: DB.staffWallets }];
		try {
			const data = await DB.staffs.findOne({ where: { id }, include });
			if (!data) return fnResponse({ status: false, message: `Staff with id ${id} not found!` });
			return fnResponse({ status: true, message: `Staff retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, name }: { id: number; name: string }) {
		try {
			const docData = await DB.staffs.findOne({ where: { id } });
			if (!docData) return fnResponse({ status: false, message: `Staff with id ${id} not found!` });
			const updateData = { name };
			await docData.update(updateData);
			return fnResponse({ status: true, message: `Staff successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.staffs.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Staff with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Staff successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async findbyBusinessId(businessId: number) {
		const include: any = [{ model: DB.staffWallets }];
		try {
			const data = await DB.staffs.findAll({ where: { businessId }, include });
			if (!data.length) return fnResponse({ status: false, message: `No staff available!` });
			return fnResponse({ status: true, message: `${data.length} staff${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async toggleStaff(id: number, action: StaffAccountMode) {
		try {
			const docData = await DB.staffs.findOne({ where: { id } });
			if (!docData) return fnResponse({ status: false, message: `Staff with id ${id} not found!` });
			const updateData = {
				status: action === 'deactivate' ? 'deactivated' : action === 'suspend' ? 'suspended' : 'active',
			};
			await docData.update(updateData);
			return fnResponse({ status: true, message: `Staff successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
