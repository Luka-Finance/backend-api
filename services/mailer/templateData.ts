// Import types
import moment from 'moment';
import { AdminOnboardingTemplateData, GetOtpTemplateDataType, MailType, typeEnum } from '../../helpers/types';

export const getOtpTemplateData = ({ otp, type }: GetOtpTemplateDataType) => {
	switch (type) {
		case typeEnum.VERIFICATION:
			return {
				mailSubject: 'Email Verification',
				mailBody: `
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, User</p>
					<p>OTP for your email verification is :</p>
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">${otp}</p>
					<p>This OTP is valid for only 10 minutes</p>
				`,
			};
		case typeEnum.RESET:
			return {
				mailSubject: 'Password Reset',
				mailBody: `
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, User</p>
					<p>OTP for your password reset request is :</p>
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">${otp}</p>
					<p>This OTP is valid for only 10 minutes</p>
				`,
			};
		case typeEnum.TWOFA:
			return {
				mailSubject: 'Two Factor Authentication',
				mailBody: `
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, User</p>
					<p>OTP for your 2FA is :</p>
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">${otp}</p>
					<p>This OTP is valid for only 10 minutes</p>
				`,
			};
		default:
			return {
				mailSubject: 'Test Email',
				mailBody: 'This is a test body',
			};
	}
};

export const adminOnboardingTemplateData = ({ names, password, role }: AdminOnboardingTemplateData) => {
	return {
		mailSubject: 'Admin Onboarding',
		mailBody: `
			<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Welcome onboard, ${names.split(' ')[0]}</p>
			<p>A ${role} admnistrative account has been registered for you.</p>
			<p>Your default password is "${password}" </p>
			<p>Pls login with your email and the default password.</p>
			<p>You will be prompted to change your account's default's password upon login.</p>
		`,
	};
};

export const forgetPasswordTemplateData = (token: string) => {
	return {
		mailSubject: 'Password Reset',
		mailBody: `
			<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, User</p>
			<p>Click on the link below to reset your password</p>
			<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">${process.env.FRONTEND_URL}/reset-password/${token}</p>
			<p>This link is valid for only 10 minutes</p>
		`,
	};
};

export const getNotificationTemplateData = ({ data, type }: { data: any; type: MailType }) => {
	switch (type) {
		case MailType.REG_SUCCESS:
			return {
				mailSubject: 'Welcome to Luka',
				mailBody: `
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, ${data.name}</p>
					<p>Welcome to Luka!</p>
					<p>${data.business.name} has added you as their staff on Luka.</p>
					<p>Please download the Luka App and activate your account</p>
					<p>Luka ID:- ${data.business.lukaId}</p>
					<p>Some other message</p>
				`,
			};
		case MailType.DAILY_INTEREST:
			return {
				mailSubject: `Luka Daily Interest | [${moment(new Date()).format('L')}]`,
				mailBody: `
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, ${data.name}</p>
					<p>Your daily earned wages of <b>NGN ${data.amount.toLocaleString()}</b> has just been added to your wallet. You now have <b>NGN ${data.balance.toLocaleString()}</b> available to use.</p>
				`,
			};
		case MailType.BUSINESS_WALLET_RESET:
			return {
				mailSubject: `Luka Wallet Reset`,
				mailBody: `
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, ${data.name}</p>
					<p>Today is expected to be payday for your staffs. Hence, their wallets has been reset to zero balance.</p>
				`,
			};
		case MailType.STAFF_WALLET_RESET:
			return {
				mailSubject: `Luka Wallet Reset`,
				mailBody: `
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, ${data.name}</p>
					<p>Today is expected to be your payday from <b>${data.businessName}</b>. Hence, your wallet has been reset to zero balance</p>
				`,
			};
		case MailType.BUSINESS_INVOICE:
			return {
				mailSubject: `Luka Monthly Invoice | ${data.invoice.title}`,
				mailBody: `
				<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, ${data.name}</p>
				<p>This is an invoice for your staffs' transactions for the afore mentioned subject. Thanks for using Luka Finance. </p>

				<table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%" cellpadding="0" cellspacing="0" role="presentation">
					<tbody>
						<tr>
							<td style="font-family: 'Montserrat',Arial,sans-serif; font-size: 14px; padding: 16px;">
							<table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%" cellpadding="0" cellspacing="0" role="presentation">
								<tbody>
									<tr>
										<td style="font-family: 'Montserrat',Arial,sans-serif; font-size: 14px;"><strong>Amount Due:</strong> NGN ${data.invoice.total}</td>
									</tr>
									<tr>
										<td style="font-family: 'Montserrat',Arial,sans-serif; font-size: 14px;"> <strong>Due By:</strong> ${moment(data.invoice.dueDate).format('LL')} </td>
									</tr>
								</tbody>
							</table>
							</td>
						</tr>
					</tbody>
				</table>

				<table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%" cellpadding="0" cellspacing="0" role="presentation">
					<tbody>
						<tr>
							<td style="font-family: 'Montserrat',Arial,sans-serif;">
								<h3 style="font-weight: 700; font-size: 12px; margin-top: 0; text-align: left;">#${14502}</h3>
							</td>
							<td style="font-family: 'Montserrat',Arial,sans-serif;">
								<h3 style="font-weight: 700; font-size: 12px; margin-top: 0; text-align: right;">
									${moment(data.invoice.createdAt).format('LL')}
								</h3>
							</td>
						</tr>
						<tr>
						<td colspan="2" style="font-family: 'Montserrat',Arial,sans-serif;">
							<table style="font-family: 'Montserrat',Arial,sans-serif; width: 100%;" width="100%" cellpadding="0" cellspacing="0" role="presentation">
							<tbody>
								<tr>
									<th align="left" style="padding-bottom: 8px;">
										<p>Description</p>
									</th>
									<th align="right" style="padding-bottom: 8px;">
										<p>Amount</p>
									</th>
								</tr>
									<tr>
										<td style="font-family: 'Montserrat',Arial,sans-serif; font-size: 14px; padding-top: 10px; padding-bottom: 10px; width: 80%;" width="80%">
											${data.invoice.items[0].description}
										</td>
										<td align="right" style="font-family: 'Montserrat',Arial,sans-serif; font-size: 14px; text-align: right; width: 20%;" width="20%">NGN ${data.invoice.items[0].amount.toLocaleString()}</td>
									</tr>
								<tr>
									<td style="font-family: 'Montserrat',Arial,sans-serif; width: 80%;" width="80%">
										<p align="right" style="font-weight: 700; font-size: 14px; line-height: 24px; margin: 0; padding-right: 16px; text-align: right;">
										Total
										</p>
									</td>
									<td style="font-family: 'Montserrat',Arial,sans-serif; width: 20%;" width="20%">
										<p align="right" style="font-weight: 700; font-size: 14px; line-height: 24px; margin: 0; text-align: right;">
										NGN ${data.invoice.total}
										</p>
									</td>
								</tr>
							</tbody>
							</table>
						</td>
						</tr>
					</tbody>
				</table>
			`,
			};
		case MailType.TRANSACTION:
			return {
				mailSubject: `${data.type.toUpperCase()} Transaction`,
				mailBody: `
					<p style="font-weight: 600; font-size: 18px; margin-bottom: 0;">Hi, ${data.name}</p>
					<p>A ${
						data.type
					} transaction of <b>NGN ${data.amount.toLocaleString()}</b> occured in your wallet. You now have <b>NGN ${data.balance.toLocaleString()}</b> available to use.</p>
				`,
			};
		default:
			break;
	}
};
