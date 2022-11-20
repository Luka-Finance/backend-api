export {};

declare global {
	namespace Express {
		interface Request {
			user?: any;
			admin?: any;
			staff?: any;
		}
	}
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			PORT: string;
			SSL: string;
			JWTSECRET: string;
			JWT_EXPIRY_TIME: string;
			DBNAME: string;
			DBUSERNAME: string;
			DBPASSWORD: string;
			DBHOST: string;
			DBPORT: string;
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
			PUBLIC_ROUTES: string;
			VERIFIED_AFRICA_API_KEY: string;
			VERIFIED_AFRICA_URL: string;
			VERIFIED_AFRICA_USERID: string;
			SEERBIT_BASE_URL: string;
			SEERBIT_PRIVATE_KEY: string;
			SEERBIT_PUBLIC_KEY: string;
			SEERBIT_BUSINESS_NAME: string;
			SEERBIT_POCKET_ID: string;
		}
	}
}
