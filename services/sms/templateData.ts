// Import types
import { GetOtpTemplateDataType, typeEnum } from '../../helpers/types';

export const getSmsOtpTemplateData = ({ otp, type }: GetOtpTemplateDataType) => {
	if (type === typeEnum.VERIFICATION) {
		return {
			mailSubject: 'Email Verification',
			smsBody: `OTP for your email verification is :\n${otp}\nThis OTP is valid for only 10 minutes\n`,
		};
	} else if (type === typeEnum.RESET) {
		return {
			mailSubject: 'Password Reset',
			smsBody: `OTP for your password reset is :\n${otp}\nThis OTP is valid for only 10 minutes\n`,
		};
	} else {
		return {
			smsSubject: 'Two Factor Authentication',
			smsBody: `OTP for your 2FA is :\n${otp}\nThis OTP is valid for only 10 minutes`,
		};
	}
};
