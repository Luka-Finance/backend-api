import * as dotenv from 'dotenv';
dotenv.config();

type Config = {
	NODE_ENV: string;
	PORT: number;
	SSL: boolean;
	JWTSECRET: string;
	JWT_EXPIRY_TIME: string;
	DBNAME: string;
	DBUSERNAME: string;
	DBPASSWORD: string;
	DBHOST: string;
	DBPORT: number;
	DBDIALECT: string;
	MAIL_FROM: string;
	MAIL_FROM_NAME: string;
	LOGO: string;
	WEBSITE: string;
	BASE_API_URL: string;
	SENDGRID_API_KEY: string;
	TWILLIO_ACCOUNT_SID: string;
	TWILLIO_AUTH_TOKEN: string;
	TWILLIO_MESSAGE_SERVICE_ID: string;
	FLUTTERWAVE_BASE_API_URL: string;
	FLUTTERWAVE_SEC_KEY: string;
	SUDO_SANDBOX_BASE_API_URL: string;
	SUDO_BASE_API_URL: string;
	SUDO_SANDBOX_VAULT_URL: string;
	SUDO_VAULT_URL: string;
	SUDO_API_KEY: string;
	VTPASS_SANDBOX_BASE_API_URL: string;
	VTPASS_BASE_URL: string;
	VTPASS_API_KEY: string;
	VTPASS_PUB_KEY: string;
	VTPASS_SEK_KEY: string;
	VTPASS_USERNAME: string;
	VTPASS_PASSWORD: string;
	PUBLIC_ROUTES: string[] | [];
	VERIFIED_AFRICA_API_KEY: string;
	VERIFIED_AFRICA_USERID: string;
	VERIFIED_AFRICA_URL: string;
	SEERBIT_BASE_URL: string;
	SEERBIT_PRIVATE_KEY: string;
	SEERBIT_PUBLIC_KEY: string;
	SEERBIT_BUSINESS_NAME: string;
	SEERBIT_POCKET_ID: string;
};

const getConfig = (): Config => {
	return {
		NODE_ENV: process.env.NODE_ENV,
		PORT: Number(process.env.PORT),
		SSL: true,
		JWTSECRET: process.env.JWTSECRET,
		JWT_EXPIRY_TIME: process.env.JWT_EXPIRY_TIME,
		DBNAME: process.env.DBNAME,
		DBUSERNAME: process.env.DBUSERNAME,
		DBPASSWORD: process.env.DBPASSWORD,
		DBHOST: process.env.DBHOST,
		DBPORT: Number(process.env.DBPORT),
		DBDIALECT: process.env.DBDIALECT,
		MAIL_FROM: process.env.MAIL_FROM,
		MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
		LOGO: process.env.LOGO,
		WEBSITE: process.env.WEBSITE,
		BASE_API_URL: process.env.BASE_API_URL,
		SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
		TWILLIO_ACCOUNT_SID: process.env.TWILLIO_ACCOUNT_SID,
		TWILLIO_AUTH_TOKEN: process.env.TWILLIO_AUTH_TOKEN,
		TWILLIO_MESSAGE_SERVICE_ID: process.env.TWILLIO_MESSAGE_SERVICE_ID,
		FLUTTERWAVE_BASE_API_URL: process.env.FLUTTERWAVE_BASE_API_URL,
		FLUTTERWAVE_SEC_KEY: process.env.FLUTTERWAVE_SEC_KEY,
		SUDO_SANDBOX_BASE_API_URL: process.env.SUDO_SANDBOX_BASE_API_URL,
		SUDO_BASE_API_URL: process.env.SUDO_BASE_API_URL,
		SUDO_SANDBOX_VAULT_URL: process.env.SUDO_SANDBOX_VAULT_URL,
		SUDO_VAULT_URL: process.env.SUDO_VAULT_URL,
		SUDO_API_KEY: process.env.SUDO_API_KEY,
		VTPASS_SANDBOX_BASE_API_URL: process.env.VTPASS_SANDBOX_BASE_API_URL,
		VTPASS_BASE_URL: process.env.VTPASS_BASE_URL,
		VTPASS_API_KEY: process.env.VTPASS_API_KEY,
		VTPASS_PUB_KEY: process.env.VTPASS_PUB_KEY,
		VTPASS_SEK_KEY: process.env.VTPASS_SEK_KEY,
		VTPASS_USERNAME: process.env.VTPASS_USERNAME,
		VTPASS_PASSWORD: process.env.VTPASS_PASSWORD,
		VERIFIED_AFRICA_API_KEY: process.env.VERIFIED_AFRICA_API_KEY,
		VERIFIED_AFRICA_USERID: process.env.VERIFIED_AFRICA_USERID,
		VERIFIED_AFRICA_URL: process.env.VERIFIED_AFRICA_URL,
		SEERBIT_BASE_URL: process.env.SEERBIT_BASE_URL,
		SEERBIT_PRIVATE_KEY: process.env.SEERBIT_PRIVATE_KEY,
		SEERBIT_PUBLIC_KEY: process.env.SEERBIT_PUBLIC_KEY,
		SEERBIT_BUSINESS_NAME: process.env.SEERBIT_BUSINESS_NAME,
		SEERBIT_POCKET_ID: process.env.SEERBIT_POCKET_ID,
		PUBLIC_ROUTES: [
			'/',
			'/run',
			'/login',
			'/register',
			'/resend-otp',
			'/verify-otp',
			'/change-password',
			'/reset-password',
			'/business/register',
			'/business/login',
			'/admin/login',
			'/admin/change-password',
			'/admin/reset-password',
			'/get-airports',
			'/flight/search',
			'/flight/select',
			'/quick-flights',
			'/payment/transfer/webhook',
			'/payment/verification/webhook',
		],
	};
};

const getSanitzedConfig = (config: Config) => {
	for (const [key, value] of Object.entries(config)) {
		if (value === undefined) {
			throw new Error(`Missing key ${key} in .env`);
		}
	}
	return config as Config;
};

const config = getConfig();
const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
