// Import db
import DB from '../../controllers/db';

// Import function files
import { fnResponse } from '../../helpers/utility';
import { PaymentDataType } from '../../helpers/types';

export class Payment {
	public async getAll({ identity, id }: PaymentDataType) {
		const where: { userId?: number } = {};
		const include: { model?: string } = {};
		if (identity === 'user') {
			where.userId = Number(id);
		}
		if (identity === 'admin') {
			include.model = DB.users;
		}
		try {
			const data = await DB.payments.findAll({ where, include, order: [['id', 'DESC']] });
			if (!data.length) return fnResponse({ status: true, message: `No payment model available!`, data });
			return fnResponse({ status: true, message: `${data.length} payment${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne({ identity, id }: PaymentDataType) {
		const include: any = [{ model: DB.bookings }];
		if (identity === 'admin') {
			include.push({ model: DB.users });
		}
		try {
			const data = await DB.payments.findOne({ where: { id }, include });
			if (!data) return fnResponse({ status: false, message: `Payment with id ${id} not found!` });
			return fnResponse({ status: true, message: `Payment listed!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
