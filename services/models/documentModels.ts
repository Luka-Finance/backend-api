import { DocumentModelDataType } from '../../helpers/types';
import { fnResponse } from '../../helpers/utility';
import DB from '../../controllers/db';

export class DocumentModel {
	public async create({ name, description, fields }: DocumentModelDataType) {
		try {
			await DB.documentModels.create({ name, description, fields });
			return fnResponse({ status: true, message: `Document model ${name} created!` });
		} catch (error) {
			// console.log(error);
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getAll() {
		try {
			const data = await DB.documentModels.findAll();
			if (!data.length) return fnResponse({ status: true, message: `No document model available!`, data });
			return fnResponse({ status: true, message: `${data.length} document${data.length > 1 ? 's' : ''} retrived!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async getOne(id: number) {
		try {
			const data = await DB.documentModels.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Document model with id ${id} not found!` });
			return fnResponse({ status: true, message: `Document model listed!`, data });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async update({ id, name, description, fields }: DocumentModelDataType) {
		try {
			const data = await DB.documentModels.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Document model with id ${id} not found!` });
			const updateData: DocumentModelDataType = { name, description, fields };
			await data.update(updateData);
			return fnResponse({ status: true, message: `Document successfully updated!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}

	public async delete(id: number) {
		try {
			const data = await DB.documentModels.findOne({ where: { id } });
			if (!data) return fnResponse({ status: false, message: `Document model with id ${id} not found!` });
			await data.destroy({ force: true });
			return fnResponse({ status: true, message: `Document successfully deleted!` });
		} catch (error) {
			return fnResponse({ status: false, message: `An error occured - ${error}` });
		}
	}
}
