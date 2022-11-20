import { QuickFlightDataType } from '../../helpers/types';
import { fnResponse } from '../../helpers/utility';
import DB from '../../controllers/db';

export class QuickFlight {
	public async create({ from, to }: QuickFlightDataType) {
		try {
			await DB.quickFlights.create({ from, to });
			return fnResponse({ status: true, message: `Quick Flight created!` });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll() {
		try {
			const data = await DB.quickFlights.findAll();
			if (!data.length) return fnResponse({ status: true, message: `No quick flights available!`, data });
			return fnResponse({ status: true, message: `${data.length} quick flight${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne(id: number) {
		try {
			const data = await DB.quickFlights.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Quick flights with id ${id} not found!` });
			return fnResponse({ status: true, message: `Quick flights listed!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, from, to }: QuickFlightDataType) {
		try {
			const data = await DB.quickFlights.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Quick flights with id ${id} not found!` });
			const updateData: QuickFlightDataType = { from, to };
			await data.update(updateData);
			return fnResponse({ status: true, message: `Quick flights successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.quickFlights.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Quick flights with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Quick flights successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
