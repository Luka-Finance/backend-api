import { body, param, CustomValidator } from 'express-validator';
import { validateData, validateObject } from '../helpers/utility';

const documentModelFields: CustomValidator = (value) => {
	const validType = ['string', 'long-text', 'integer'];
	const err: string[] = [];
	value.forEach((data: any) => {
		if (!validType.includes(data.type)) {
			err.push(`type can only include ${validType} ${data.type}`);
		}
	});
	if (err.length) throw new Error(`type can only include ${validType}`);
	return true;
};

const adminRouteValidation = (method: string): any => {
	switch (method) {
		case 'id': {
			return [param('id').isInt().withMessage('ID must be a number!')];
		}
		case '/document-model/create': {
			const validSearchType = ['Return', 'Oneway', 'Multidestination'];
			const validTicketClass = ['F', 'C', 'W', 'Y'];
			const validCurrency = ['NGN', 'USD'];
			return [
				body('name').not().isEmpty().isString().withMessage('name Data is required!'),
				body('description').not().isEmpty().isString().withMessage('description Data is required!'),
				body('fields').not().isEmpty().custom(documentModelFields),
			];
		}

		case '/flight/select': {
			const validCurrency = ['NGN', 'USD'];
			return [
				body('TargetCurrency')
					.not()
					.isEmpty()
					.custom((value) => validCurrency.includes(value))
					.withMessage(`TargetCurrency can only include ${validCurrency}`),
				body('SelectData').not().isEmpty().isString().withMessage('Select Data is required!'),
			];
		}

		case '/book/flight': {
			return [
				body('PassengerDetails').not().isEmpty().isArray().withMessage('PassengerDetails must be an array of objects'),
				body('BookingItemModels').not().isEmpty().isArray().withMessage('BookingItemModels must be an array of objects'),
			];
		}

		case '/payment/link': {
			return [
				body('bookingId').not().isEmpty().isString().withMessage('Select Data is required!'),
				body('saveCard')
					.not()
					.isEmpty()
					.isString()
					.withMessage('Select Data is required!')
					.isBoolean()
					.withMessage('saveCard be a boolean true or false'),
			];
		}
	}
};

export default adminRouteValidation;
