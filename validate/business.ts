import { BusinessVerificationType } from './../helpers/types';
import { body, param, CustomValidator } from 'express-validator';

const business = (method: string): any => {
	switch (method) {
		case '/register': {
			return [
				body('name').not().isEmpty().isString().withMessage('Name is required'),
				body('phone').not().isEmpty().isString().withMessage('Phone is required!'),
				body('email').not().isEmpty().isString().withMessage('Email is required!'),
				body('password').not().isEmpty().isString().withMessage('Password is required!'),
				body('country').not().isEmpty().isString().withMessage('Country is required!'),
				body('city').not().isEmpty().isString().withMessage('City is required!'),
				// body('payday')
				// 	.isInt({
				// 		min: 1,
				// 		max: 30,
				// 	})
				// 	.optional({ nullable: true })
				// 	.withMessage('Payday is required!'),
				body('type').isString().optional({ nullable: true }).withMessage('Type is required!'),
			];
		}
		case '/update-profile': {
			return [
				body('name').optional({ nullable: true }).isString(),
				body('phone').optional({ nullable: true }).isString(),
				body('country').optional({ nullable: true }).isString(),
				body('city').optional({ nullable: true }).isString(),
				body('paysTransactionFee').optional({ nullable: true }).isString(),
				body('payday').optional({ nullable: true }).isInt({
					min: 1,
					max: 30,
				}),
				body('rcNumber').optional({ nullable: true }).isString(),
				body('type')
					.optional({ nullable: true })
					.custom((value: string) => {
						if (value !== 'registered' && value !== 'non-registered') {
							throw new Error('Type must be either registered or non-registered');
						}
						return true;
					}),
				body('address').optional({ nullable: true }).isString(),
				body('contactPersonName').optional({ nullable: true }).isString(),
				body('contactPersonEmail').optional({ nullable: true }).isString(),
				body('contactPersonRole').optional({ nullable: true }).isString(),
				body('contactPersonPhone').optional({ nullable: true }).isString(),
				body('cacDoc').optional({ nullable: true }).isString(),
			];
		}
		case '/login': {
			return [
				body('email').not().isEmpty().isString().withMessage('Email is required!'),
				body('password').not().isEmpty().isString().withMessage('Password is required!'),
			];
		}
		case '/resend-otp': {
			// const validType = [ValidOtpType.VERIFICATION, ValidOtpType.RESET, ValidOtpType.TWOFA];
			return [
				// emai, phone, type are required
				body('email').not().isEmpty().isString().withMessage('Email is required!'),
				body('phone').not().isEmpty().isString().withMessage('Phone is required!'),
				body('type').not().isEmpty().isString().withMessage('Type is required!'),
			];
		}
		case '/verify-otp': {
			return [
				body('token').not().isEmpty().isString().withMessage('Token is required!'),
				body('otp').not().isEmpty().isString().withMessage('otp is required!'),
				body('client').not().isEmpty().isString().withMessage('client is required!'),
				body('type').not().isEmpty().isString().withMessage('type is required!'),
			];
		}

		case '/verify/rc': {
			return [
				body('companyName').not().isEmpty().isString().withMessage('companyName is required'),
				body('rcNumber').not().isEmpty().isString().withMessage('rcNumber is required'),
			];
		}
		case '/verify/tin': {
			return [body('searchParameter').not().isEmpty().isString().withMessage('searchParameter is required')];
		}
		case '/forget-password': {
			return [body('email').not().isEmpty().isString().withMessage('Email is required!')];
		}
		case '/reset-password': {
			return [
				body('password').not().isEmpty().isString().withMessage('Password is required!'),
				body('token').not().isEmpty().isString().withMessage('Token is required!'),
			];
		}
		case '/change-password': {
			return [
				body('password').not().isEmpty().isString().withMessage('Password is required!'),
				body('newPassword').not().isEmpty().isString().withMessage('New Password is required!'),
			];
		}
	}
};

export default business;
