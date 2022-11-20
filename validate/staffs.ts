import { StaffRoles, StaffAccountMode } from './../helpers/types';
import { body, param } from 'express-validator';
import {
	CableServiceIDs,
	CableSubscriptionType,
	DataServiceIDs,
	PowerServiceIDs,
	PowerVariationCode,
	UitilityType,
	ValidOtpType,
	ValidStatus,
} from '../helpers/types';

const users = (method: string): any => {
	switch (method) {
		case '/register': {
			const validType = [StaffRoles.REGULAR];
			return [
				body('firstName').not().isEmpty().isString().withMessage('firstName is required!'),
				body('lastName').not().isEmpty().isString().withMessage('lastName is required!'),
				body('otherName').optional().isString().withMessage('otherName is required'),
				body('email').not().isEmpty().isEmail().withMessage('Email is required!'),
				// body('password').not().isEmpty().isString().withMessage('Password is required!'),
				body('phone').not().isEmpty().isString().withMessage('Phone is required!'),
				body('salary').not().isEmpty().isString().withMessage('Phone is required!'),
				body('role')
					.not()
					.isEmpty()
					.custom((value) => validType.includes(value)),
				body('gender')
					.optional()
					.custom((value: string) => {
						if (value && value.toLowerCase().match(/^(male|female)$/)) {
							return true;
						}
						throw new Error();
					}),
				body('businessId')
					.not()
					.isEmpty()
					.custom((value) => {
						return Number(value);
					})
					.withMessage('businessId is required!'),
				body('startDate').not().isEmpty().isString().withMessage('startDate is required!'),
			];
		}
		case '/login': {
			return [
				body('email').not().isEmpty().isString().withMessage('Email is required!').optional({ checkFalsy: true }),
				body('phone').not().isEmpty().isString().withMessage('Phone is required!').optional({ checkFalsy: true }),
				body('password').not().isEmpty().isString().withMessage('Password is required!'),
				body('businessId')
					.not()
					.isEmpty()
					.custom((value) => {
						return Number(value);
					})
					.withMessage('businessId is required!'),
			];
		}
		case '/resend-otp': {
			const validType = [ValidOtpType.VERIFICATION, ValidOtpType.RESET, ValidOtpType.TWOFA];
			return [
				body('email').not().isEmpty().isString().withMessage('Email is required!'),
				body('type')
					.not()
					.isEmpty()
					.custom((value) => validType.includes(value))
					.withMessage(`type can only include ${validType}`),
				body('businessId').not().isEmpty().isString().withMessage('businessId is required!'),
			];
		}
		case '/update-staff-settings': {
			return [body('twoFa').not().isEmpty().isBoolean().withMessage('2fa is required and must be boolean!')];
		}
		case '/update-staff-profile': {
			return [
				body('email').optional().isString().withMessage('Email is required!'),
				body('names').optional().isString().withMessage('Names is required!'),
				body('phone').optional().isString().withMessage('Phone is required!'),
			];
		}
		case '/update-password': {
			return [
				body('email').not().isEmpty().isString().withMessage('Email is required!'),
				body('oldPassword').not().isEmpty().isString().withMessage('Old password is required!'),
				body('newPassword').not().isEmpty().isString().withMessage('New password is required!'),
			];
		}
		case '/reset-password': {
			return [body('email').not().isEmpty().isString().withMessage('Email is required!')];
		}
		case '/change-password': {
			return [
				body('token').not().isEmpty().isString().withMessage('token is required!'),
				body('password').not().isEmpty().isString().withMessage('password is required!'),
			];
		}
		case '/verify-otp': {
			const validType = [ValidOtpType.VERIFICATION, ValidOtpType.RESET, ValidOtpType.TWOFA];
			return [
				body('token').not().isEmpty().isString().withMessage('token is required!'),
				body('client').not().isEmpty().isString().withMessage('client is required!'),
				body('type')
					.not()
					.isEmpty()
					.custom((value) => {
						return validType.includes(value);
					})
					.withMessage(`type can only include ${validType}`),
				body('otp')
					.not()
					.isEmpty()
					.custom((value) => {
						return Number(value);
					})
					.withMessage('otp is required!'),
			];
		}
		case '/update/status': {
			const validStatus = [ValidStatus.ACTIVATED, ValidStatus.DEACTIVATED];
			return [
				param('id').isInt().withMessage('ID must be a number!'),
				body('status')
					.not()
					.isEmpty()
					.custom((value) => {
						return validStatus.includes(value);
					})
					.withMessage(`status can only include ${validStatus}`),
			];
		}
		case 'id': {
			return [param('id').isInt().withMessage('ID must be a number!')];
		}
		case '/set-trans-pin': {
			return [
				body('pin')
					.not()
					.isEmpty()
					.custom((value) => Number(value))
					.withMessage('Pin must be a number'),
			];
		}
		case '/create-password': {
			return [body('password').not().isEmpty().isString().withMessage('password is required!')];
		}
		case '/utility/get-variation-codes': {
			const validServiceIdType = [
				DataServiceIDs.AIRTEL_DATA,
				DataServiceIDs.ETISALAT_DATA,
				DataServiceIDs.GLO_DATA,
				DataServiceIDs.MTN_DATA,
				DataServiceIDs.SMILE_NETWORK,
				DataServiceIDs.SPECTRANET,
				PowerServiceIDs.AEDC,
				PowerServiceIDs.EKEDC,
				PowerServiceIDs.IBEDC,
				PowerServiceIDs.IKEDC,
				PowerServiceIDs.JED,
				PowerServiceIDs.KAEDCO,
				PowerServiceIDs.KEDCO,
				PowerServiceIDs.PHED,
				CableServiceIDs.DSTV,
				CableServiceIDs.GOTV,
				CableServiceIDs.STARTIMES,
			];
			return [
				param('serviceId')
					.custom((value) => validServiceIdType.includes(value))
					.withMessage(`type can only include ${validServiceIdType}`),
			];
		}
		case '/utility/verify-merchant': {
			const validServiceIdType = [
				DataServiceIDs.AIRTEL_DATA,
				DataServiceIDs.ETISALAT_DATA,
				DataServiceIDs.GLO_DATA,
				DataServiceIDs.MTN_DATA,
				DataServiceIDs.SMILE_NETWORK,
				DataServiceIDs.SPECTRANET,
				PowerServiceIDs.AEDC,
				PowerServiceIDs.EKEDC,
				PowerServiceIDs.IBEDC,
				PowerServiceIDs.IKEDC,
				PowerServiceIDs.JED,
				PowerServiceIDs.KAEDCO,
				PowerServiceIDs.KEDCO,
				PowerServiceIDs.PHED,
				CableServiceIDs.DSTV,
				CableServiceIDs.GOTV,
				CableServiceIDs.STARTIMES,
			];
			const merchantType = [PowerVariationCode.POSTPAID, PowerVariationCode.PREPAID];
			return [
				body('merchantCode').isInt().withMessage('ID must be a number!'),
				body('serviceId')
					.custom((value) => validServiceIdType.includes(value))
					.withMessage(`type can only include ${validServiceIdType}`),
				body('merchantType')
					.custom((value) => merchantType.includes(value))
					.withMessage(`type can only include ${merchantType}`)
					.optional({ checkFalsy: true }),
			];
		}
		case '/utility/purchase': {
			const validUtilityType = [UitilityType.AIRTIME, UitilityType.CABLE, UitilityType.DATA, UitilityType.POWER];
			const validSubscriptionType = [CableSubscriptionType.CHANGE, CableSubscriptionType.RENEW];
			return [
				param('type')
					.custom((value) => validUtilityType.includes(value))
					.withMessage(`type can only include ${validUtilityType}`),
				body('amount')
					.not()
					.isEmpty()
					.custom((value) => Number(value))
					.withMessage('amount must be a number')
					.optional({ checkFalsy: true }),
				body('phone').not().isEmpty().isString().withMessage('Phone is required!').optional({ checkFalsy: true }),
				body('serviceId').not().isEmpty().isString().withMessage('serviceId is required!'),
				body('merchantCode').not().isEmpty().isString().withMessage('merchantCode is required!').optional({ checkFalsy: true }),
				body('variation_code').not().isEmpty().isString().withMessage('serviceId is required!').optional({ checkFalsy: true }),
				body('subscription_type')
					.not()
					.isEmpty()
					.custom((value) => {
						return validSubscriptionType.includes(value);
					})
					.withMessage(`subscription_type can only include ${validSubscriptionType}`)
					.optional({ checkFalsy: true }),
				body('quantity')
					.not()
					.isEmpty()
					.custom((value) => Number(value))
					.withMessage('quantity must be a number')
					.optional({ checkFalsy: true }),
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

		case '/:businessId/staffs': {
			return [param('businessId').not().isEmpty().isString().withMessage('businessId is required!')];
		}
		case '/business/toggle/:staffId': {
			const validType = [StaffAccountMode.DEACTIVATE, StaffAccountMode.RESTORE, StaffAccountMode.SUSPEND];

			return [
				param('staffId').not().isEmpty().isString().withMessage('id is required!'),
				body('action')
					.not()
					.isEmpty()
					.custom((value) => validType.includes(value)),
			];
		}
	}
};

export default users;
