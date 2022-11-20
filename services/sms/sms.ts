import { Twilio } from 'twilio';
import config from '../../config/configSetup';
import { SendSmsDataType } from '../../helpers/types';

export const sendSms = async ({ phone, text }: SendSmsDataType) => {
	const accountSid = config.TWILLIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
	const authToken = config.TWILLIO_AUTH_TOKEN;
	const client: any = new Twilio(accountSid, authToken);
	console.log(phone);
	client.messages
		.create({
			body: text,
			messagingServiceSid: config.TWILLIO_MESSAGE_SERVICE_ID,
			to: phone,
			// from: '+2347067869400', // From a valid Twilio number
		})
		.then(async (response: any) => {
			console.log(response);
			if (response.status === 'sent' || response.status === 'accepted') return { status: true, message: `Sms successfully sent to ${phone}` };
			return { status: false, message: 'Sms sending failed!' };
		})
		.catch((error: any) => {
			console.log(error);
			return { status: false, message: 'Sms sending failed!' };
		});
	return {
		status: true,
		message: `Text sent`,
	};
};

export const prepareSms = async ({ phone, text }: SendSmsDataType) => {
	const _sendSms: any = await sendSms({
		phone,
		text,
	});
	return { status: _sendSms.status, message: _sendSms.message };
};
