import { fnResponse } from '../../helpers/utility';
import DB from '../../controllers/db';

export class Setting {
	public async create({ key, value }: { key: string; value: string }) {
		try {
			await DB.settings.create({ key, value });
			return fnResponse({ status: true, message: `Settings created!` });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll() {
		try {
			const data = await DB.settings.findAll();
			if (!data.length) return fnResponse({ status: true, message: `No settings available!`, data });
			return fnResponse({ status: true, message: `${data.length} setting${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne(id: number) {
		try {
			const data = await DB.settings.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Setting with id ${id} not found!` });
			return fnResponse({ status: true, message: `Setting listed!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, value }: { id: number; value: string }) {
		try {
			const data = await DB.settings.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Setting with id ${id} not found!` });
			await data.update({ value });
			return fnResponse({ status: true, message: `Setting successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.settings.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Setting with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Setting successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
